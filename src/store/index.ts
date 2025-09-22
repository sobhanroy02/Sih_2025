import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// User types
export type UserRole = 'citizen' | 'admin' | 'worker'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  municipality?: string
  city?: string
  ward?: string
  department?: string
  avatar?: string
  verified: boolean
  phone?: string
}

// Issue types
export type IssueStatus = 'open' | 'in-progress' | 'resolved' | 'closed'
export type IssuePriority = 'low' | 'medium' | 'high' | 'critical'
export type IssueCategory = 'pothole' | 'streetlight' | 'garbage' | 'water' | 'graffiti' | 'road' | 'other'

export interface Issue {
  id: string
  title: string
  description: string
  category: IssueCategory
  priority: IssuePriority
  status: IssueStatus
  location: {
    address: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  images: string[]
  reportedBy: string
  reportedAt: Date
  updatedAt: Date
  assignedTo?: string
  upvotes: number
  comments: Comment[]
}

export interface Comment {
  id: string
  content: string
  author: string
  createdAt: Date
  isOfficial: boolean
}

// Auth Store
interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: User) => void
  logout: () => void
  updateUser: (updates: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateUser: (updates) => {
        const currentUser = get().user
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } })
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

// Issues Store
interface IssuesState {
  issues: Issue[]
  selectedIssue: Issue | null
  filters: {
    category?: IssueCategory
    status?: IssueStatus
    priority?: IssuePriority
    sortBy: 'recent' | 'popular' | 'distance'
    searchQuery: string
  }
  addIssue: (issue: Issue) => void
  updateIssue: (id: string, updates: Partial<Issue>) => void
  deleteIssue: (id: string) => void
  setSelectedIssue: (issue: Issue | null) => void
  setFilters: (filters: Partial<IssuesState['filters']>) => void
  upvoteIssue: (id: string) => void
  addComment: (issueId: string, comment: Comment) => void
}

export const useIssuesStore = create<IssuesState>()(
  persist(
    (set) => ({
      issues: [
        {
          id: '1',
          title: 'Large pothole on Main Street',
          description: 'There\'s a dangerous pothole near the intersection of Main Street and Oak Avenue. It\'s about 2 feet wide and quite deep, causing damage to vehicles.',
          category: 'pothole',
          priority: 'high',
          status: 'open',
          location: {
            address: 'Main Street & Oak Avenue, Downtown',
            coordinates: { lat: 40.7128, lng: -74.0060 }
          },
          images: [],
          reportedBy: 'user1',
          reportedAt: new Date('2024-01-15T10:30:00'),
          updatedAt: new Date('2024-01-15T10:30:00'),
          upvotes: 12,
          comments: []
        },
        {
          id: '2',
          title: 'Broken street light on Elm Street',
          description: 'The street light on Elm Street has been out for over a week, making the area unsafe for pedestrians at night.',
          category: 'streetlight',
          priority: 'medium',
          status: 'in-progress',
          location: {
            address: 'Elm Street, Residential District',
            coordinates: { lat: 40.7589, lng: -73.9851 }
          },
          images: [],
          reportedBy: 'user2',
          reportedAt: new Date('2024-01-12T18:45:00'),
          updatedAt: new Date('2024-01-14T09:15:00'),
          upvotes: 8,
          comments: []
        },
        {
          id: '3',
          title: 'Overflowing garbage bins at Central Park',
          description: 'Multiple garbage bins near the main entrance of Central Park are overflowing, attracting pests and creating an unsanitary environment.',
          category: 'garbage',
          priority: 'medium',
          status: 'resolved',
          location: {
            address: 'Central Park Main Entrance',
            coordinates: { lat: 40.7829, lng: -73.9654 }
          },
          images: [],
          reportedBy: 'user3',
          reportedAt: new Date('2024-01-10T14:20:00'),
          updatedAt: new Date('2024-01-13T16:30:00'),
          upvotes: 15,
          comments: []
        },
        {
          id: '4',
          title: 'Water leak on Pine Avenue',
          description: 'There\'s a significant water leak coming from an underground pipe on Pine Avenue. Water is pooling on the street and sidewalk.',
          category: 'water',
          priority: 'critical',
          status: 'in-progress',
          location: {
            address: 'Pine Avenue, near house #245',
            coordinates: { lat: 40.7505, lng: -73.9934 }
          },
          images: [],
          reportedBy: 'user4',
          reportedAt: new Date('2024-01-16T08:15:00'),
          updatedAt: new Date('2024-01-16T11:30:00'),
          upvotes: 22,
          comments: []
        },
        {
          id: '5',
          title: 'Graffiti on library building',
          description: 'New graffiti has appeared on the side wall of the public library building, affecting the building\'s appearance.',
          category: 'graffiti',
          priority: 'low',
          status: 'open',
          location: {
            address: 'Public Library, West Side Wall',
            coordinates: { lat: 40.7614, lng: -73.9776 }
          },
          images: [],
          reportedBy: 'user5',
          reportedAt: new Date('2024-01-14T16:45:00'),
          updatedAt: new Date('2024-01-14T16:45:00'),
          upvotes: 5,
          comments: []
        }
      ],
      selectedIssue: null,
      filters: {
        sortBy: 'recent',
        searchQuery: '',
      },
      addIssue: (issue) =>
        set((state) => ({ issues: [issue, ...state.issues] })),
      updateIssue: (id, updates) =>
        set((state) => ({
          issues: state.issues.map((issue) =>
            issue.id === id ? { ...issue, ...updates } : issue
          ),
        })),
      deleteIssue: (id) =>
        set((state) => ({
          issues: state.issues.filter((issue) => issue.id !== id),
        })),
      setSelectedIssue: (issue) => set({ selectedIssue: issue }),
      setFilters: (filters) =>
        set((state) => ({
          filters: { ...state.filters, ...filters },
        })),
      upvoteIssue: (id) =>
        set((state) => ({
          issues: state.issues.map((issue) =>
            issue.id === id ? { ...issue, upvotes: issue.upvotes + 1 } : issue
          ),
        })),
      addComment: (issueId, comment) =>
        set((state) => ({
          issues: state.issues.map((issue) =>
            issue.id === issueId
              ? { ...issue, comments: [...issue.comments, comment] }
              : issue
          ),
        })),
    }),
    {
      name: 'issues-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

// UI Store
interface UIState {
  sidebarOpen: boolean
  notificationsOpen: boolean
  loading: Record<string, boolean>
  setSidebarOpen: (open: boolean) => void
  setNotificationsOpen: (open: boolean) => void
  setLoading: (key: string, loading: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  notificationsOpen: false,
  loading: {},
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setNotificationsOpen: (open) => set({ notificationsOpen: open }),
  setLoading: (key, loading) =>
    set((state) => ({
      loading: { ...state.loading, [key]: loading },
    })),
}))

// Notifications Store
export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  createdAt: Date
  read: boolean
  actionUrl?: string
}

interface NotificationsState {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
}

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set) => ({
      notifications: [],
      unreadCount: 0,
      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          read: false,
        }
        set((state) => ({
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }))
      },
      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((notif) =>
            notif.id === id ? { ...notif, read: true } : notif
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        })),
      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((notif) => ({
            ...notif,
            read: true,
          })),
          unreadCount: 0,
        })),
      removeNotification: (id) =>
        set((state) => {
          const notification = state.notifications.find((n) => n.id === id)
          const wasUnread = notification && !notification.read
          return {
            notifications: state.notifications.filter((notif) => notif.id !== id),
            unreadCount: wasUnread ? state.unreadCount - 1 : state.unreadCount,
          }
        }),
    }),
    {
      name: 'notifications-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)