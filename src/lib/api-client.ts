// Utility functions for making API calls to the backend

// Type definitions for API responses
export interface ApiResponse<T = Record<string, unknown>> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// API Client configuration
const API_BASE = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

// Helper function to make API calls with error handling
export async function apiCall<T = Record<string, unknown>>(
  endpoint: string,
  options?: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
    body?: Record<string, unknown>
    headers?: Record<string, string>
  }
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE}/api${endpoint}`
    const method = options?.method || 'GET'

    const fetchOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    }

    if (options?.body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      fetchOptions.body = JSON.stringify(options.body)
    }

    const response = await fetch(url, fetchOptions)
    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP ${response.status}`,
        data: data as T
      }
    }

    return {
      success: true,
      data: data as T,
      message: data.message
    }
  } catch (error) {
    console.error(`API call failed (${endpoint}):`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// ============================================
// Authentication APIs
// ============================================

export async function signup(credentials: {
  email: string
  password: string
  name: string
  phone?: string
  municipality?: string
  city?: string
  ward_number?: string
  user_type?: 'citizen' | 'admin' | 'worker'
  location?: { latitude: number; longitude: number }
}) {
  return apiCall('/auth/signup', {
    method: 'POST',
    body: credentials
  })
}

export async function login(credentials: {
  email: string
  password: string
}) {
  return apiCall('/auth/login', {
    method: 'POST',
    body: credentials
  })
}

export async function logout() {
  return apiCall('/auth/logout', {
    method: 'POST'
  })
}

export async function getProfile() {
  return apiCall('/auth/profile', {
    method: 'GET'
  })
}

export async function updateProfile(data: {
  name?: string
  phone?: string
  municipality?: string
  city?: string
  ward_number?: string
  avatar_url?: string
  location?: { latitude: number; longitude: number }
}) {
  return apiCall('/auth/profile', {
    method: 'PUT',
    body: data
  })
}

// ============================================
// Issues APIs
// ============================================

export async function getIssues(filters?: {
  page?: number
  limit?: number
  status?: string
  category?: string
  priority?: string
  my_issues?: boolean
  lat?: number
  lng?: number
  radius?: number
}) {
  const params = new URLSearchParams()
  if (filters?.page) params.append('page', String(filters.page))
  if (filters?.limit) params.append('limit', String(filters.limit))
  if (filters?.status) params.append('status', filters.status)
  if (filters?.category) params.append('category', filters.category)
  if (filters?.priority) params.append('priority', filters.priority)
  if (filters?.my_issues) params.append('my_issues', String(filters.my_issues))
  if (filters?.lat) params.append('lat', String(filters.lat))
  if (filters?.lng) params.append('lng', String(filters.lng))
  if (filters?.radius) params.append('radius', String(filters.radius))

  const query = params.toString()
  return apiCall(`/issues${query ? '?' + query : ''}`, {
    method: 'GET'
  })
}

export async function createIssue(data: {
  title: string
  description: string
  category: string
  priority?: 'low' | 'medium' | 'high' | 'critical'
  location: { latitude: number; longitude: number }
  address: string
  attachments?: Array<{
    file_url: string
    file_type: 'image' | 'video' | 'document'
    file_size?: number
    metadata?: Record<string, unknown>
  }>
}) {
  return apiCall('/issues', {
    method: 'POST',
    body: data
  })
}

export async function getIssueDetail(issueId: string) {
  return apiCall(`/issues/${issueId}`, {
    method: 'GET'
  })
}

export async function updateIssue(issueId: string, data: {
  title?: string
  description?: string
  category?: string
  priority?: 'low' | 'medium' | 'high' | 'critical'
  status?: 'open' | 'assigned' | 'in_progress' | 'resolved' | 'closed'
  location?: { latitude: number; longitude: number }
  address?: string
  assigned_worker_id?: string | null
  department_id?: string | null
  estimated_resolution_time?: string | null
}) {
  return apiCall(`/issues/${issueId}`, {
    method: 'PUT',
    body: data
  })
}

export async function deleteIssue(issueId: string) {
  return apiCall(`/issues/${issueId}`, {
    method: 'DELETE'
  })
}

// ============================================
// Comments APIs
// ============================================

export async function getComments(issueId: string, filters?: {
  page?: number
  limit?: number
}) {
  const params = new URLSearchParams()
  if (filters?.page) params.append('page', String(filters.page))
  if (filters?.limit) params.append('limit', String(filters.limit))

  const query = params.toString()
  return apiCall(`/issues/${issueId}/comments${query ? '?' + query : ''}`, {
    method: 'GET'
  })
}

export async function addComment(issueId: string, data: {
  content: string
  is_private?: boolean
}) {
  return apiCall(`/issues/${issueId}/comments`, {
    method: 'POST',
    body: data
  })
}

// ============================================
// Voting APIs
// ============================================

export async function voteOnIssue(issueId: string, voteType: 'upvote' | 'downvote') {
  return apiCall(`/issues/${issueId}/vote`, {
    method: 'POST',
    body: { vote_type: voteType }
  })
}

export async function getIssueVotes(issueId: string) {
  return apiCall(`/issues/${issueId}/vote`, {
    method: 'GET'
  })
}

// ============================================
// Notifications APIs
// ============================================

export async function getNotifications(filters?: {
  page?: number
  limit?: number
  unread_only?: boolean
}) {
  const params = new URLSearchParams()
  if (filters?.page) params.append('page', String(filters.page))
  if (filters?.limit) params.append('limit', String(filters.limit))
  if (filters?.unread_only) params.append('unread_only', String(filters.unread_only))

  const query = params.toString()
  return apiCall(`/notifications${query ? '?' + query : ''}`, {
    method: 'GET'
  })
}

export async function markNotificationsAsRead(data: {
  notification_ids?: string[]
  mark_all?: boolean
}) {
  return apiCall('/notifications', {
    method: 'PUT',
    body: data
  })
}

export async function deleteNotifications(data: {
  notification_ids?: string[]
  delete_all?: boolean
}) {
  return apiCall('/notifications', {
    method: 'DELETE',
    body: data
  })
}

// ============================================
// File Upload APIs
// ============================================

export async function uploadFile(file: File, issueId?: string) {
  try {
    const formData = new FormData()
    formData.append('file', file)
    if (issueId) formData.append('issueId', issueId)

    const url = `${API_BASE}/api/upload`
    const response = await fetch(url, {
      method: 'POST',
      body: formData
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP ${response.status}`
      }
    }

    return {
      success: true,
      data
    }
  } catch (error) {
    console.error('File upload failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    }
  }
}

export async function getSignedUrl(filePath: string) {
  const params = new URLSearchParams()
  params.append('path', filePath)

  return apiCall(`/upload?${params.toString()}`, {
    method: 'GET'
  })
}

// ============================================
// Analytics APIs
// ============================================

export async function getSimpleAnalytics() {
  return apiCall('/analytics/simple', {
    method: 'GET'
  })
}
