import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
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

    const formData = await request.formData()
    const file = formData.get('file') as File
    const issueId = formData.get('issueId') as string
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/png', 
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/quicktime',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'File type not allowed' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop()
    const fileName = `${uuidv4()}.${fileExtension}`
    const filePath = issueId ? `${issueId}/${fileName}` : `general/${fileName}`

    // Convert file to buffer
    const fileBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(fileBuffer)

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('issue-attachments')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('issue-attachments')
      .getPublicUrl(filePath)

    // Determine file type category
    let fileTypeCategory: 'image' | 'video' | 'document' = 'document'
    if (file.type.startsWith('image/')) {
      fileTypeCategory = 'image'
    } else if (file.type.startsWith('video/')) {
      fileTypeCategory = 'video'
    }

    // If issueId is provided, save attachment record
    if (issueId) {
      await supabase
        .from('issue_attachments')
        .insert({
          issue_id: issueId,
          file_url: publicUrl,
          file_type: fileTypeCategory,
          file_size: file.size,
          metadata: {
            originalName: file.name,
            uploadedBy: user.id,
            uploadedAt: new Date().toISOString()
          }
        })
    }

    return NextResponse.json({
      message: 'File uploaded successfully',
      file: {
        url: publicUrl,
        type: fileTypeCategory,
        size: file.size,
        originalName: file.name,
        path: filePath
      }
    }, { status: 200 })

  } catch (error) {
    console.error('File upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET - Get signed URL for private file access (if needed)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filePath = searchParams.get('path')
    
    if (!filePath) {
      return NextResponse.json(
        { error: 'File path is required' },
        { status: 400 }
      )
    }

    const supabase = createServerSupabaseClient()
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Generate signed URL (valid for 1 hour)
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from('issue-attachments')
      .createSignedUrl(filePath, 3600) // 1 hour

    if (signedUrlError) {
      return NextResponse.json(
        { error: 'Failed to generate signed URL' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      signedUrl: signedUrlData.signedUrl
    }, { status: 200 })

  } catch (error) {
    console.error('Get signed URL error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}