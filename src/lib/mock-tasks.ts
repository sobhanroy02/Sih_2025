export type AssignedTask = {
  id: string
  title: string
  description: string
  assignedDate: string
  status: 'assigned' | 'in-progress' | 'completed'
  location?: string
  priority?: 'low' | 'medium' | 'high' | 'critical'
}

export type InProgressTask = {
  id: string
  title: string
  startDate: string
  progress: number // 0-100
  trend?: number[] // sparkline values
}

export const assignedTasks: AssignedTask[] = [
  { id: 'T-1001', title: 'Fix Streetlight - Ward 12', description: 'Streetlight not working near Pine & 5th', assignedDate: '2025-10-10', status: 'assigned', location: 'Pine & 5th', priority: 'medium' },
  { id: 'T-1002', title: 'Pothole Repair - Main St', description: 'Large pothole causing traffic issues', assignedDate: '2025-10-11', status: 'assigned', location: 'Main Street', priority: 'high' },
  { id: 'T-1003', title: 'Drain Cleaning - Riverside', description: 'Overflowing drain near park entrance', assignedDate: '2025-10-12', status: 'assigned', location: 'Riverside Park', priority: 'medium' },
]

export const inProgressTasks: InProgressTask[] = [
  { id: 'T-2001', title: 'Streetlight Fix - Elm 3rd', startDate: '2025-10-08', progress: 60, trend: [10,20,25,40,48,60] },
  { id: 'T-2002', title: 'Drain Clean - Riverside', startDate: '2025-10-09', progress: 35, trend: [0,5,10,20,28,35] },
]

export function getAssignedTaskById(id: string) {
  return assignedTasks.find(t => t.id === id)
}

export type CompletedTask = { id: string; title: string; completedDate: string }

export const completedTasks: CompletedTask[] = [
  { id: 'T-0901', title: 'Tree Trimming - Central Ave', completedDate: '2025-09-28' },
  { id: 'T-0902', title: 'Road Patch - Oak St', completedDate: '2025-09-30' },
  { id: 'T-1004', title: 'Garbage Removal - Warehouse Ln', completedDate: '2025-10-03' },
]

export function getTaskCounts() {
  return {
    assigned: assignedTasks.length,
    inProgress: inProgressTasks.length,
    completed: completedTasks.length,
  }
}
