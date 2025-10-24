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
            address: 'Esplanade, Kolkata, West Bengal, India',
            coordinates: { lat: 22.5726, lng: 88.3639 }
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
            address: 'Howrah Maidan, Howrah, West Bengal, India',
            coordinates: { lat: 22.5892, lng: 88.3419 }
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
            address: 'Eco Park Main Gate, New Town, Kolkata, West Bengal, India',
            coordinates: { lat: 22.6207, lng: 88.465 }
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
            address: 'EM Bypass near Ruby General Hospital, Kolkata, West Bengal, India',
            coordinates: { lat: 22.5145, lng: 88.3995 }
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
            address: 'Park Street, Kolkata, West Bengal, India',
            coordinates: { lat: 22.5522, lng: 88.3528 }
          },
          images: [],
          reportedBy: 'user5',
          reportedAt: new Date('2024-01-14T16:45:00'),
          updatedAt: new Date('2024-01-14T16:45:00'),
          upvotes: 5,
          comments: []
        }
        ,
        {
          id: '6',
          title: 'Damaged pedestrian crossing near City Hall',
          description: 'The zebra crossing paint has faded and the curb ramp is cracked, making it unsafe for pedestrians and wheelchairs.',
          category: 'road',
          priority: 'medium',
          status: 'open',
          location: {
            address: 'KMC HQ, S.N. Banerjee Rd, Kolkata, West Bengal, India',
            coordinates: { lat: 22.5677, lng: 88.351 }
          },
          images: [],
          reportedBy: 'user6',
          reportedAt: new Date('2024-01-18T09:10:00'),
          updatedAt: new Date('2024-01-18T09:10:00'),
          upvotes: 11,
          comments: []
        },
        {
          id: '7',
          title: 'Overflowing drain near Riverside Park',
          description: 'Storm drain is clogged with leaves causing water to pool and flow onto the sidewalk after rain.',
          category: 'water',
          priority: 'medium',
          status: 'in-progress',
          location: {
            address: 'Prinsep Ghat Riverside, Kolkata, West Bengal, India',
            coordinates: { lat: 22.5482, lng: 88.335 }
          },
          images: [],
          reportedBy: 'user7',
          reportedAt: new Date('2024-01-17T12:25:00'),
          updatedAt: new Date('2024-01-18T08:00:00'),
          upvotes: 9,
          comments: []
        },
        {
          id: '8',
          title: 'Streetlight flickering on Pine & 5th',
          description: 'The corner streetlight flickers continuously at night, reducing visibility for drivers and pedestrians.',
          category: 'streetlight',
          priority: 'low',
          status: 'open',
          location: {
            address: 'Salt Lake Sector V, Ring Road Crossing, Kolkata, West Bengal, India',
            coordinates: { lat: 22.5793, lng: 88.431 }
          },
          images: [],
          reportedBy: 'user8',
          reportedAt: new Date('2024-01-19T21:05:00'),
          updatedAt: new Date('2024-01-19T21:05:00'),
          upvotes: 4,
          comments: []
        },
        {
          id: '9',
          title: 'Illegal dumping near warehouse lane',
          description: 'Piles of construction debris and broken furniture dumped along the lane; attracting pests.',
          category: 'garbage',
          priority: 'high',
          status: 'open',
          location: {
            address: 'Topsia Industrial Estate, Kolkata, West Bengal, India',
            coordinates: { lat: 22.544, lng: 88.393 }
          },
          images: [],
          reportedBy: 'user9',
          reportedAt: new Date('2024-01-20T07:40:00'),
          updatedAt: new Date('2024-01-20T07:40:00'),
          upvotes: 18,
          comments: []
        },
        {
          id: '10',
          title: 'Broken bench and sharp edges in park',
          description: 'A public bench has splintered wood and exposed nails posing a hazard to children.',
          category: 'other',
          priority: 'medium',
          status: 'in-progress',
          location: {
            address: 'Rabindra Sadan Park, Kolkata, West Bengal, India',
            coordinates: { lat: 22.5395, lng: 88.3527 }
          },
          images: [],
          reportedBy: 'user10',
          reportedAt: new Date('2024-01-18T15:55:00'),
          updatedAt: new Date('2024-01-19T10:10:00'),
          upvotes: 7,
          comments: []
        },
        {
          id: '11',
          title: 'Potholes along bus route on Cedar St',
          description: 'Multiple potholes forming a cluster causing buses to swerve; immediate attention suggested.',
          category: 'pothole',
          priority: 'critical',
          status: 'open',
          location: {
            address: 'BT Road near Dunlop, Kolkata, West Bengal, India',
            coordinates: { lat: 22.655, lng: 88.373 }
          },
          images: [],
          reportedBy: 'user11',
          reportedAt: new Date('2024-01-21T06:30:00'),
          updatedAt: new Date('2024-01-21T06:30:00'),
          upvotes: 26,
          comments: []
        },
        {
          id: '12',
          title: 'Water seepage in underpass',
          description: 'Persistent water seepage causing slippery floor and algae growth; needs drainage fix.',
          category: 'water',
          priority: 'high',
          status: 'in-progress',
          location: {
            address: 'Sealdah Underpass, Kolkata, West Bengal, India',
            coordinates: { lat: 22.5621, lng: 88.3686 }
          },
          images: [],
          reportedBy: 'user12',
          reportedAt: new Date('2024-01-22T11:20:00'),
          updatedAt: new Date('2024-01-22T14:00:00'),
          upvotes: 13,
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
      name: 'issues-storage-v2',
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