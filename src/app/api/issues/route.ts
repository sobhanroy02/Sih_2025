import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { z } from 'zod'

// Validation schema for creating an issue
const createIssueSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  location: z.object({
    latitude: z.number(),
    longitude: z.number()
  }),
  address: z.string().min(1, 'Address is required'),
  attachments: z.array(z.object({
    file_url: z.string(),
    file_type: z.enum(['image', 'video', 'document']),
    file_size: z.number().optional(),
    metadata: z.object({
      originalName: z.string().optional(),
      description: z.string().optional()
    }).optional()
  })).optional()
})

// GET - Get all issues (with filters)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const supabase = createServerSupabaseClient()
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const priority = searchParams.get('priority')
    const my_issues = searchParams.get('my_issues') === 'true'
    const lat = parseFloat(searchParams.get('lat') || '0')
    const lng = parseFloat(searchParams.get('lng') || '0')
    const radius = parseFloat(searchParams.get('radius') || '0') // in meters

    const offset = (page - 1) * limit

    // Build query
    let query = supabase
      .from('issues')
      .select(`
        *,
        user:users!issues_user_id_fkey(name, email),
        assigned_worker:workers!issues_assigned_worker_id_fkey(
          id,
          worker_id,
          user:users!workers_user_id_fkey(name)
        ),
        department:departments!issues_department_id_fkey(name),
        issue_attachments(*)
      `)

    // Apply filters
    if (my_issues) {
      query = query.eq('user_id', user.id)
    }
    
    if (status) {
      query = query.eq('status', status)
    }
    
    if (category) {
      query = query.eq('category', category)
    }
    
    if (priority) {
      query = query.eq('priority', priority)
    }

    // Apply location filter (simplified - in production use PostGIS ST_DWithin)
    if (lat && lng && radius > 0) {
      // This is a simplified implementation
      // In production, you would use PostGIS for proper geospatial queries
    }

    // Apply pagination and ordering
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    const { data: issues, error: issuesError } = await query

    if (issuesError) {
      return NextResponse.json(
        { error: 'Failed to fetch issues' },
        { status: 500 }
      )
    }

    // Get total count for pagination
    let countQuery = supabase
      .from('issues')
      .select('*', { count: 'exact', head: true })

    if (my_issues) {
      countQuery = countQuery.eq('user_id', user.id)
    }
    if (status) {
      countQuery = countQuery.eq('status', status)
    }
    if (category) {
      countQuery = countQuery.eq('category', category)
    }
    if (priority) {
      countQuery = countQuery.eq('priority', priority)
    }

    const { count } = await countQuery

    return NextResponse.json({
      issues,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    }, { status: 200 })

  } catch (error) {
    console.error('Get issues error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create a new issue
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validatedData = createIssueSchema.parse(body)
    
    const supabase = createServerSupabaseClient()
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Create location point
    const locationPoint = `POINT(${validatedData.location.longitude} ${validatedData.location.latitude})`

    // Create the issue
    const { data: issue, error: issueError } = await supabase
      .from('issues')
      .insert({
        title: validatedData.title,
        description: validatedData.description,
        category: validatedData.category,
        priority: validatedData.priority,
        location: locationPoint,
        address: validatedData.address,
        user_id: user.id,
        status: 'open',
        upvotes: 0,
        views: 0
      })
      .select()
      .single()

    if (issueError || !issue) {
      return NextResponse.json(
        { error: 'Failed to create issue' },
        { status: 500 }
      )
    }

    // Create attachments if provided
    if (validatedData.attachments && validatedData.attachments.length > 0) {
      const attachmentInserts = validatedData.attachments.map(attachment => ({
        issue_id: issue.id,
        file_url: attachment.file_url,
        file_type: attachment.file_type,
        file_size: attachment.file_size,
        metadata: attachment.metadata
      }))

      await supabase
        .from('issue_attachments')
        .insert(attachmentInserts)
    }

    // Log issue creation
    await supabase
      .from('analytics')
      .insert({
        event_type: 'issue_created',
        user_id: user.id,
        entity_type: 'issue',
        entity_id: issue.id,
        metadata: {
          category: validatedData.category,
          priority: validatedData.priority,
          location: [validatedData.location.longitude, validatedData.location.latitude],
          timestamp: new Date().toISOString()
        }
      })

    return NextResponse.json({
      message: 'Issue created successfully',
      issue: {
        id: issue.id,
        title: issue.title,
        description: issue.description,
        category: issue.category,
        priority: issue.priority,
        status: issue.status,
        address: issue.address,
        created_at: issue.created_at
      }
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Create issue error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}