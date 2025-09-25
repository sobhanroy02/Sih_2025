import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Client-side Supabase client (guard against missing env vars in local demo)
export const supabase = ((): ReturnType<typeof createClient> | null => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('[supabase] Environment variables missing; returning null client')
    }
    return null
  }
  return createClient(url, key)
})()

// Server-side Supabase client
export function createServerSupabaseClient() {
  // In some Next.js versions/types this may be typed as Promise<ReadonlyRequestCookies>
  // so normalize to a sync-like accessor.
  const possibleStore = cookies() as unknown
  type CookieValue = { value?: string }
  interface CookieStoreLike {
    get?: (name: string) => CookieValue | undefined
    set?: (args: { name: string; value: string; [k: string]: unknown }) => void
  }
  const getStore = (): CookieStoreLike | undefined => {
    if (
      typeof (possibleStore as { then?: unknown })?.then === 'function'
    )
      return undefined
    return possibleStore as CookieStoreLike
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    interface MinimalServerAuthClient {
      auth: { getUser: () => Promise<{ data: { user: null }; error: null }> }
    }
    const stub: MinimalServerAuthClient = {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
      },
    }
    return stub as unknown as SupabaseClient
  }
  return createServerClient(
    url,
    key,
    {
      cookies: {
        get(name: string) {
          const store = getStore()
          return store?.get?.(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            const store = getStore()
            store?.set?.({ name, value, ...options })
          } catch {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            const store = getStore()
            store?.set?.({ name, value: '', ...options })
          } catch {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

// Admin client for server-side operations
export const supabaseAdmin: SupabaseClient | null = (() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !service) return null
  return createClient(url, service, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
})()

// GeoJSON types for PostGIS
export type Point = {
  type: 'Point'
  coordinates: [number, number] // [longitude, latitude]
}

export type Polygon = {
  type: 'Polygon'
  coordinates: [number, number][][]
}

export type ContactInfo = {
  email?: string
  phone?: string
  address?: string
}

export type WorkingHours = {
  monday?: string
  tuesday?: string
  wednesday?: string
  thursday?: string
  friday?: string
  saturday?: string
  sunday?: string
}

export type FileMetadata = {
  originalName?: string
  uploadedBy?: string
  description?: string
}

export type Skills = string[]

export type ShiftSchedule = {
  start_time: string
  end_time: string
  days: string[]
}

export type PerformanceMetrics = {
  issues_resolved: number
  average_resolution_time: number
  citizen_rating: number
}

// Database types
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          phone: string | null
          user_type: 'citizen' | 'admin' | 'worker'
          municipality: string | null
          city: string | null
          ward_number: string | null
          location: Point | null
          is_verified: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          phone?: string | null
          user_type: 'citizen' | 'admin' | 'worker'
          municipality?: string | null
          city?: string | null
          ward_number?: string | null
          location?: Point | null
          is_verified?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          phone?: string | null
          user_type?: 'citizen' | 'admin' | 'worker'
          municipality?: string | null
          city?: string | null
          ward_number?: string | null
          location?: Point | null
          is_verified?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      issues: {
        Row: {
          id: string
          title: string
          description: string
          category: string
          priority: 'low' | 'medium' | 'high' | 'critical'
          status: 'open' | 'assigned' | 'in_progress' | 'resolved' | 'closed'
          location: Point
          address: string
          user_id: string
          assigned_worker_id: string | null
          department_id: string | null
          ai_confidence: number | null
          ai_category: string | null
          upvotes: number
          views: number
          estimated_resolution_time: string | null
          resolved_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          category: string
          priority: 'low' | 'medium' | 'high' | 'critical'
          status?: 'open' | 'assigned' | 'in_progress' | 'resolved' | 'closed'
          location: Point
          address: string
          user_id: string
          assigned_worker_id?: string | null
          department_id?: string | null
          ai_confidence?: number | null
          ai_category?: string | null
          upvotes?: number
          views?: number
          estimated_resolution_time?: string | null
          resolved_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category?: string
          priority?: 'low' | 'medium' | 'high' | 'critical'
          status?: 'open' | 'assigned' | 'in_progress' | 'resolved' | 'closed'
          location?: Point
          address?: string
          user_id?: string
          assigned_worker_id?: string | null
          department_id?: string | null
          ai_confidence?: number | null
          ai_category?: string | null
          upvotes?: number
          views?: number
          estimated_resolution_time?: string | null
          resolved_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      issue_attachments: {
        Row: {
          id: string
          issue_id: string
          file_url: string
          file_type: 'image' | 'video' | 'document'
          file_size: number | null
          metadata: FileMetadata | null
          uploaded_at: string
        }
        Insert: {
          id?: string
          issue_id: string
          file_url: string
          file_type: 'image' | 'video' | 'document'
          file_size?: number | null
          metadata?: FileMetadata | null
          uploaded_at?: string
        }
        Update: {
          id?: string
          issue_id?: string
          file_url?: string
          file_type?: 'image' | 'video' | 'document'
          file_size?: number | null
          metadata?: FileMetadata | null
          uploaded_at?: string
        }
      }
      departments: {
        Row: {
          id: string
          name: string
          description: string | null
          municipality: string
          coverage_area: Polygon | null
          contact_info: ContactInfo | null
          working_hours: WorkingHours | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          municipality: string
          coverage_area?: Polygon | null
          contact_info?: ContactInfo | null
          working_hours?: WorkingHours | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          municipality?: string
          coverage_area?: Polygon | null
          contact_info?: ContactInfo | null
          working_hours?: WorkingHours | null
          is_active?: boolean
          created_at?: string
        }
      }
      workers: {
        Row: {
          id: string
          user_id: string
          worker_id: string
          department_id: string
          current_location: Point | null
          skills: Skills | null
          availability_status: 'available' | 'busy' | 'offline' | 'on_break'
          shift_schedule: ShiftSchedule | null
          performance_metrics: PerformanceMetrics | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          worker_id: string
          department_id: string
          current_location?: Point | null
          skills?: Skills | null
          availability_status?: 'available' | 'busy' | 'offline' | 'on_break'
          shift_schedule?: ShiftSchedule | null
          performance_metrics?: PerformanceMetrics | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          worker_id?: string
          department_id?: string
          current_location?: Point | null
          skills?: Skills | null
          availability_status?: 'available' | 'busy' | 'offline' | 'on_break'
          shift_schedule?: ShiftSchedule | null
          performance_metrics?: PerformanceMetrics | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}