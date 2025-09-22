import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { z } from 'zod'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

// Validation schema for voting
const voteSchema = z.object({
  vote_type: z.enum(['upvote', 'downvote'])
})

// POST - Vote on an issue
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validatedData = voteSchema.parse(body)
    
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
      .select('id, user_id, upvotes')
      .eq('id', resolvedParams.id)
      .single()

    if (issueError || !issue) {
      return NextResponse.json(
        { error: 'Issue not found' },
        { status: 404 }
      )
    }

    // Check if user already voted
    const { data: existingVote, error: voteCheckError } = await supabase
      .from('issue_votes')
      .select('vote_type')
      .eq('issue_id', resolvedParams.id)
      .eq('user_id', user.id)
      .single()

    if (voteCheckError && voteCheckError.code !== 'PGRST116') {
      // PGRST116 is "no rows returned" which is expected if no vote exists
      return NextResponse.json(
        { error: 'Failed to check existing vote' },
        { status: 500 }
      )
    }

    let voteChange = 0

    if (existingVote) {
      // User already voted
      if (existingVote.vote_type === validatedData.vote_type) {
        // Same vote type - remove the vote (unlike)
        const { error: deleteError } = await supabase
          .from('issue_votes')
          .delete()
          .eq('issue_id', resolvedParams.id)
          .eq('user_id', user.id)

        if (deleteError) {
          return NextResponse.json(
            { error: 'Failed to remove vote' },
            { status: 500 }
          )
        }

        voteChange = validatedData.vote_type === 'upvote' ? -1 : 1
      } else {
        // Different vote type - update the vote
        const { error: updateError } = await supabase
          .from('issue_votes')
          .update({ vote_type: validatedData.vote_type })
          .eq('issue_id', resolvedParams.id)
          .eq('user_id', user.id)

        if (updateError) {
          return NextResponse.json(
            { error: 'Failed to update vote' },
            { status: 500 }
          )
        }

        voteChange = validatedData.vote_type === 'upvote' ? 2 : -2
      }
    } else {
      // New vote
      const { error: insertError } = await supabase
        .from('issue_votes')
        .insert({
          issue_id: resolvedParams.id,
          user_id: user.id,
          vote_type: validatedData.vote_type
        })

      if (insertError) {
        return NextResponse.json(
          { error: 'Failed to add vote' },
          { status: 500 }
        )
      }

      voteChange = validatedData.vote_type === 'upvote' ? 1 : -1
    }

    // Update upvote count on the issue
    const newUpvotes = Math.max(0, (issue.upvotes || 0) + voteChange)
    
    const { error: updateUpvotesError } = await supabase
      .from('issues')
      .update({ upvotes: newUpvotes })
      .eq('id', resolvedParams.id)

    if (updateUpvotesError) {
      return NextResponse.json(
        { error: 'Failed to update vote count' },
        { status: 500 }
      )
    }

    // Log vote event
    await supabase
      .from('analytics')
      .insert({
        event_type: 'issue_voted',
        user_id: user.id,
        entity_type: 'issue',
        entity_id: resolvedParams.id,
        metadata: {
          vote_type: validatedData.vote_type,
          vote_change: voteChange,
          new_upvotes: newUpvotes,
          timestamp: new Date().toISOString()
        }
      })

    return NextResponse.json({
      message: 'Vote recorded successfully',
      upvotes: newUpvotes,
      userVote: voteChange === 0 ? null : validatedData.vote_type
    }, { status: 200 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Vote error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET - Get vote status for current user on an issue
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
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

    // Get user's vote for this issue
    const { data: vote, error: voteError } = await supabase
      .from('issue_votes')
      .select('vote_type')
      .eq('issue_id', resolvedParams.id)
      .eq('user_id', user.id)
      .single()

    if (voteError && voteError.code !== 'PGRST116') {
      return NextResponse.json(
        { error: 'Failed to fetch vote status' },
        { status: 500 }
      )
    }

    // Get issue upvotes count
    const { data: issue, error: issueError } = await supabase
      .from('issues')
      .select('upvotes')
      .eq('id', resolvedParams.id)
      .single()

    if (issueError || !issue) {
      return NextResponse.json(
        { error: 'Issue not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      upvotes: issue.upvotes || 0,
      userVote: vote?.vote_type || null
    }, { status: 200 })

  } catch (error) {
    console.error('Get vote status error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}