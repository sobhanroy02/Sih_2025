import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { z } from 'zod'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

// Validation schema for creating a comment
const createCommentSchema = z.object({
  content: z.string().min(1, 'Comment content is required'),
  is_private: z.boolean().default(false)
})

// GET - Get comments for an issue
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { searchParams } = new URL(request.url)
    const supabase = createServerSupabaseClient()
    
    // Await params
    const resolvedParams = await params
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    // Get user profile to check if they can see private comments
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('user_type')
      .eq('id', user.id)
      .single()

    if (profileError || !userProfile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    // Check if issue exists
    const { data: issue, error: issueError } = await supabase
      .from('issues')
      .select('id, user_id')
      .eq('id', resolvedParams.id)
      .single()

    if (issueError || !issue) {
      return NextResponse.json(
        { error: 'Issue not found' },
        { status: 404 }
      )
    }

    // Build query for comments
    let query = supabase
      .from('issue_comments')
      .select(`
        *,
        user:users!issue_comments_user_id_fkey(id, name, user_type)
      `)
      .eq('issue_id', resolvedParams.id)

    // Filter private comments based on user permissions
    const canSeePrivateComments = 
      userProfile.user_type === 'admin' || 
      userProfile.user_type === 'worker' ||
      issue.user_id === user.id

    if (!canSeePrivateComments) {
      query = query.eq('is_private', false)
    }

    // Apply pagination and ordering
    query = query
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1)

    const { data: comments, error: commentsError } = await query

    if (commentsError) {
      return NextResponse.json(
        { error: 'Failed to fetch comments' },
        { status: 500 }
      )
    }

    // Get total count for pagination
    let countQuery = supabase
      .from('issue_comments')
      .select('*', { count: 'exact', head: true })
      .eq('issue_id', resolvedParams.id)

    if (!canSeePrivateComments) {
      countQuery = countQuery.eq('is_private', false)
    }

    const { count } = await countQuery

    return NextResponse.json({
      comments,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    }, { status: 200 })

  } catch (error) {
    console.error('Get comments error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Add a comment to an issue
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validatedData = createCommentSchema.parse(body)
    
    const supabase = createServerSupabaseClient()
    
    // Await params
    const resolvedParams = await params
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Check if issue exists
    const { data: issue, error: issueError } = await supabase
      .from('issues')
      .select('id, user_id')
      .eq('id', resolvedParams.id)
      .single()

    if (issueError || !issue) {
      return NextResponse.json(
        { error: 'Issue not found' },
        { status: 404 }
      )
    }

    // Get user profile to check permissions for private comments
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('user_type')
      .eq('id', user.id)
      .single()

    if (profileError || !userProfile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    // Check if user can create private comments
    const canCreatePrivateComments = 
      userProfile.user_type === 'admin' || 
      userProfile.user_type === 'worker' ||
      issue.user_id === user.id

    if (validatedData.is_private && !canCreatePrivateComments) {
      return NextResponse.json(
        { error: 'Not authorized to create private comments' },
        { status: 403 }
      )
    }

    // Create the comment
    const { data: comment, error: commentError } = await supabase
      .from('issue_comments')
      .insert({
        issue_id: resolvedParams.id,
        user_id: user.id,
        content: validatedData.content,
        is_private: validatedData.is_private
      })
      .select(`
        *,
        user:users!issue_comments_user_id_fkey(id, name, user_type)
      `)
      .single()

    if (commentError || !comment) {
      return NextResponse.json(
        { error: 'Failed to create comment' },
        { status: 500 }
      )
    }

    // Create notification for issue owner (if not private and not the same user)
    if (!validatedData.is_private && issue.user_id !== user.id) {
      await supabase
        .from('notifications')
        .insert({
          user_id: issue.user_id,
          title: 'New Comment on Your Issue',
          message: `${userProfile.user_type === 'citizen' ? 'A citizen' : 'A worker'} commented on your issue.`,
          type: 'issue_update',
          reference_id: resolvedParams.id
        })
    }

    // Log comment creation
    await supabase
      .from('analytics')
      .insert({
        event_type: 'comment_created',
        user_id: user.id,
        entity_type: 'issue',
        entity_id: resolvedParams.id,
        metadata: {
          comment_id: comment.id,
          is_private: validatedData.is_private,
          timestamp: new Date().toISOString()
        }
      })

    return NextResponse.json({
      message: 'Comment added successfully',
      comment
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Create comment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}