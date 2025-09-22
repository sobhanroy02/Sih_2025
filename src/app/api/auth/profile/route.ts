import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { z } from 'zod'

// Validation schema for profile update
const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  phone: z.string().optional(),
  municipality: z.string().optional(),
  city: z.string().optional(),
  ward_number: z.string().optional(),
  location: z.object({
    latitude: z.number(),
    longitude: z.number()
  }).optional()
})

// GET - Get user profile
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

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    // Convert location point to coordinates if exists
    let coordinates = null
    if (profile.location) {
      // This is a simplified conversion - in production you'd use PostGIS functions
      coordinates = {
        latitude: profile.location.coordinates?.[1],
        longitude: profile.location.coordinates?.[0]
      }
    }

    return NextResponse.json({
      user: {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        phone: profile.phone,
        user_type: profile.user_type,
        municipality: profile.municipality,
        city: profile.city,
        ward_number: profile.ward_number,
        location: coordinates,
        is_verified: profile.is_verified,
        is_active: profile.is_active,
        created_at: profile.created_at,
        updated_at: profile.updated_at
      }
    }, { status: 200 })

  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validatedData = updateProfileSchema.parse(body)
    
    const supabase = createServerSupabaseClient()
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Prepare update data
    interface UpdateData {
      name?: string
      phone?: string | null
      municipality?: string | null
      city?: string | null
      ward_number?: string | null
      location?: string | null
    }
    
    const updateData: UpdateData = {}
    
    if (validatedData.name) updateData.name = validatedData.name
    if (validatedData.phone !== undefined) updateData.phone = validatedData.phone
    if (validatedData.municipality !== undefined) updateData.municipality = validatedData.municipality
    if (validatedData.city !== undefined) updateData.city = validatedData.city
    if (validatedData.ward_number !== undefined) updateData.ward_number = validatedData.ward_number
    
    // Handle location update
    if (validatedData.location) {
      updateData.location = `POINT(${validatedData.location.longitude} ${validatedData.location.latitude})`
    }

    // Update profile
    const { data: updatedProfile, error: updateError } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', user.id)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 400 }
      )
    }

    // Log profile update
    await supabase
      .from('analytics')
      .insert({
        event_type: 'profile_updated',
        user_id: user.id,
        entity_type: 'user',
        entity_id: user.id,
        metadata: {
          updated_fields: Object.keys(updateData),
          timestamp: new Date().toISOString()
        }
      })

    // Convert location point to coordinates if exists
    let coordinates = null
    if (updatedProfile.location) {
      coordinates = {
        latitude: updatedProfile.location.coordinates?.[1],
        longitude: updatedProfile.location.coordinates?.[0]
      }
    }

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedProfile.id,
        email: updatedProfile.email,
        name: updatedProfile.name,
        phone: updatedProfile.phone,
        user_type: updatedProfile.user_type,
        municipality: updatedProfile.municipality,
        city: updatedProfile.city,
        ward_number: updatedProfile.ward_number,
        location: coordinates,
        is_verified: updatedProfile.is_verified,
        is_active: updatedProfile.is_active,
        updated_at: updatedProfile.updated_at
      }
    }, { status: 200 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Update profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}