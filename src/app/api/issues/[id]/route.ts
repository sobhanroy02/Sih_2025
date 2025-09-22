import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { z } from 'zod'

// Validation schema for updating an issue
const updateIssueSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  category: z.string().min(1, 'Category is required').optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  status: z.enum(['open', 'assigned', 'in_progress', 'resolved', 'closed']).optional(),
  location: z.object({
    latitude: z.number(),
    longitude: z.number()
  }).optional(),
  address: z.string().min(1, 'Address is required').optional(),
  assigned_worker_id: z.string().nullable().optional(),
  department_id: z.string().nullable().optional(),
  estimated_resolution_time: z.string().nullable().optional()
})

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

// GET - Get a specific issue by ID
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

    // Get the issue with related data
    const { data: issue, error: issueError } = await supabase
      .from('issues')
      .select(`
        *,
        user:users!issues_user_id_fkey(id, name, email),
        assigned_worker:workers!issues_assigned_worker_id_fkey(
          id,
          worker_id,
          user:users!workers_user_id_fkey(name, email)
        ),
        department:departments!issues_department_id_fkey(id, name, description),
        issue_attachments(*),
        issue_comments(
          *,
          user:users!issue_comments_user_id_fkey(name)
        )
      `)
      .eq('id', resolvedParams.id)
      .single()

    if (issueError || !issue) {
      return NextResponse.json(
        { error: 'Issue not found' },
        { status: 404 }
      )
    }

    // Increment view count
    await supabase
      .from('issues')
      .update({ views: (issue.views || 0) + 1 })
      .eq('id', resolvedParams.id)

    // Log issue view
    await supabase
      .from('analytics')
      .insert({
        event_type: 'issue_viewed',
        user_id: user.id,
        entity_type: 'issue',
        entity_id: issue.id,
        metadata: {
          timestamp: new Date().toISOString()
        }
      })

    // Convert location point to coordinates if exists
    let coordinates = null
    if (issue.location) {
      coordinates = {
        latitude: issue.location.coordinates?.[1],
        longitude: issue.location.coordinates?.[0]
      }
    }

    return NextResponse.json({
      issue: {
        ...issue,
        location: coordinates
      }
    }, { status: 200 })

  } catch (error) {
    console.error('Get issue error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update an issue
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validatedData = updateIssueSchema.parse(body)
    
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

    // Get current issue to check permissions
    const { data: currentIssue, error: currentIssueError } = await supabase
      .from('issues')
      .select('user_id, status')
      .eq('id', resolvedParams.id)
      .single()

    if (currentIssueError || !currentIssue) {
      return NextResponse.json(
        { error: 'Issue not found' },
        { status: 404 }
      )
    }

    // Get user profile to check permissions
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

    // Check permissions
    const canEdit = 
      currentIssue.user_id === user.id || // Owner can edit
      userProfile.user_type === 'admin' || // Admin can edit
      (userProfile.user_type === 'worker' && 
       ['assigned_worker_id', 'status', 'estimated_resolution_time'].some(field => field in validatedData)) // Workers can update assignment fields

    if (!canEdit) {
      return NextResponse.json(
        { error: 'Not authorized to update this issue' },
        { status: 403 }
      )
    }

    // Prepare update data
    interface UpdateData {
      title?: string
      description?: string
      category?: string
      priority?: 'low' | 'medium' | 'high' | 'critical'
      status?: 'open' | 'assigned' | 'in_progress' | 'resolved' | 'closed'
      location?: string
      address?: string
      assigned_worker_id?: string | null
      department_id?: string | null
      estimated_resolution_time?: string | null
      resolved_at?: string | null
    }
    
    const updateData: UpdateData = {}
    
    if (validatedData.title) updateData.title = validatedData.title
    if (validatedData.description) updateData.description = validatedData.description
    if (validatedData.category) updateData.category = validatedData.category
    if (validatedData.priority) updateData.priority = validatedData.priority
    if (validatedData.status) {
      updateData.status = validatedData.status
      if (validatedData.status === 'resolved') {
        updateData.resolved_at = new Date().toISOString()
      }
    }
    if (validatedData.address) updateData.address = validatedData.address
    if (validatedData.assigned_worker_id !== undefined) updateData.assigned_worker_id = validatedData.assigned_worker_id
    if (validatedData.department_id !== undefined) updateData.department_id = validatedData.department_id
    if (validatedData.estimated_resolution_time !== undefined) updateData.estimated_resolution_time = validatedData.estimated_resolution_time
    
    // Handle location update
    if (validatedData.location) {
      updateData.location = `POINT(${validatedData.location.longitude} ${validatedData.location.latitude})`
    }

    // Update the issue
    const { data: updatedIssue, error: updateError } = await supabase
      .from('issues')
      .update(updateData)
      .eq('id', resolvedParams.id)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update issue' },
        { status: 400 }
      )
    }

    // Create update record for audit trail
    for (const [field, newValue] of Object.entries(updateData)) {
      await supabase
        .from('issue_updates')
        .insert({
          issue_id: resolvedParams.id,
          updated_by: user.id,
          field_name: field,
          old_value: String(currentIssue[field as keyof typeof currentIssue] || ''),
          new_value: String(newValue || '')
        })
    }

    // Log issue update
    await supabase
      .from('analytics')
      .insert({
        event_type: 'issue_updated',
        user_id: user.id,
        entity_type: 'issue',
        entity_id: resolvedParams.id,
        metadata: {
          updated_fields: Object.keys(updateData),
          timestamp: new Date().toISOString()
        }
      })

    return NextResponse.json({
      message: 'Issue updated successfully',
      issue: updatedIssue
    }, { status: 200 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Update issue error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete an issue
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

    // Get current issue to check permissions
    const { data: issue, error: issueError } = await supabase
      .from('issues')
      .select('user_id')
      .eq('id', resolvedParams.id)
      .single()

    if (issueError || !issue) {
      return NextResponse.json(
        { error: 'Issue not found' },
        { status: 404 }
      )
    }

    // Get user profile to check permissions
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

    // Check permissions (only owner or admin can delete)
    if (issue.user_id !== user.id && userProfile.user_type !== 'admin') {
      return NextResponse.json(
        { error: 'Not authorized to delete this issue' },
        { status: 403 }
      )
    }

    // Delete the issue (cascading deletes will handle related records)
    const { error: deleteError } = await supabase
      .from('issues')
      .delete()
      .eq('id', resolvedParams.id)

    if (deleteError) {
      return NextResponse.json(
        { error: 'Failed to delete issue' },
        { status: 500 }
      )
    }

    // Log issue deletion
    await supabase
      .from('analytics')
      .insert({
        event_type: 'issue_deleted',
        user_id: user.id,
        entity_type: 'issue',
        entity_id: resolvedParams.id,
        metadata: {
          timestamp: new Date().toISOString()
        }
      })

    return NextResponse.json({
      message: 'Issue deleted successfully'
    }, { status: 200 })

  } catch (error) {
    console.error('Delete issue error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}