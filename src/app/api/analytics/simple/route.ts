import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

// GET - Get basic analytics data
export async function GET() {
  try {
    const supabase = createServerSupabaseClient()
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Check if user is admin
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

    // Only admins can access analytics
    if (userProfile.user_type !== 'admin') {
      return NextResponse.json(
        { error: 'Not authorized to access analytics' },
        { status: 403 }
      )
    }

    // Get basic counts
    const [
      { count: totalIssues },
      { count: totalUsers },
      { count: totalWorkers },
      { count: resolvedIssues },
      { count: openIssues }
    ] = await Promise.all([
      supabase.from('issues').select('*', { count: 'exact', head: true }),
      supabase.from('users').select('*', { count: 'exact', head: true }).eq('user_type', 'citizen'),
      supabase.from('users').select('*', { count: 'exact', head: true }).eq('user_type', 'worker'),
      supabase.from('issues').select('*', { count: 'exact', head: true }).eq('status', 'resolved'),
      supabase.from('issues').select('*', { count: 'exact', head: true }).eq('status', 'open')
    ])

    // Get issues by category
    const { data: issuesByCategory } = await supabase
      .from('issues')
      .select('category')

    const categoryStats = issuesByCategory?.reduce((acc: Record<string, number>, issue) => {
      acc[issue.category] = (acc[issue.category] || 0) + 1
      return acc
    }, {}) || {}

    // Get issues by priority
    const { data: issuesByPriority } = await supabase
      .from('issues')
      .select('priority')

    const priorityStats = issuesByPriority?.reduce((acc: Record<string, number>, issue) => {
      acc[issue.priority] = (acc[issue.priority] || 0) + 1
      return acc
    }, {}) || {}

    const analytics = {
      overview: {
        totalIssues: totalIssues || 0,
        totalUsers: totalUsers || 0,
        totalWorkers: totalWorkers || 0,
        resolvedIssues: resolvedIssues || 0,
        openIssues: openIssues || 0,
        resolutionRate: totalIssues ? ((resolvedIssues || 0) / totalIssues * 100).toFixed(2) : '0'
      },
      byCategory: categoryStats,
      byPriority: priorityStats
    }

    return NextResponse.json({
      data: analytics,
      generated_at: new Date().toISOString()
    }, { status: 200 })

  } catch (error) {
    console.error('Get analytics error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}