"use client"

import React, { useMemo } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import WorkerNavbar from '@/components/layout/WorkerNavbar'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { getAssignedTaskById } from '@/lib/mock-tasks'

export default function WorkerAssignedDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const task = useMemo(() => getAssignedTaskById(String(params?.id)), [params?.id])

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <WorkerNavbar />
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-6 text-center">
            <div className="text-gray-900 dark:text-white font-semibold">Task not found</div>
            <Link href="/worker/assigned" className="mt-3 inline-block text-sm text-primary-600 hover:underline">Back to Assigned</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <WorkerNavbar />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-4">
          <Link href="/worker/assigned" className="text-sm text-gray-600 dark:text-gray-300 hover:underline">← Back</Link>
        </div>
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{task.title}</h1>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{task.description}</p>
              </div>
              <span className="inline-flex items-center h-6 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 px-2 text-xs font-medium capitalize">{task.status}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900">
                <div className="text-xs text-gray-500">Assigned on</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">{task.assignedDate}</div>
              </div>
              <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900">
                <div className="text-xs text-gray-500">Location</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">{task.location || '—'}</div>
              </div>
              <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900">
                <div className="text-xs text-gray-500">Priority</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white capitalize">{task.priority || 'medium'}</div>
              </div>
              <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900">
                <div className="text-xs text-gray-500">Task ID</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">{task.id}</div>
              </div>
            </div>
            <div className="pt-2 flex justify-end gap-2">
              <Link href={{ pathname: '/worker/in-progress', query: { start: task.id } }} className="rounded-md bg-primary-600 px-3 py-2 text-white text-sm hover:bg-primary-500">Start Task</Link>
              <Button variant="secondary" onClick={() => router.push('/worker/assigned')}>Close</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
