"use client"

import React, { useMemo } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import WorkerNavbar from '@/components/layout/WorkerNavbar'
import { inProgressTasks as baseData } from '@/lib/mock-tasks'

function Sparkline({ values }: { values: number[] }) {
  const width = 160
  const height = 40
  const max = Math.max(...values, 100)
  const min = Math.min(...values, 0)
  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * width
    const y = height - ((v - min) / (max - min || 1)) * height
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width={width} height={height} className="mt-2">
      <polyline fill="none" stroke="#2563eb" strokeWidth="2" points={points} />
    </svg>
  )
}

export default function WorkerInProgressPage() {
  const sp = useSearchParams()
  const start = sp.get('start') || undefined
  const tasks = useMemo(() => {
    if (start) {
      // If navigated from Assigned with a task to start, add a mocked entry
      return [
        { id: start, title: `Task ${start}`, startDate: new Date().toISOString().slice(0,10), progress: 5, trend: [0,2,3,4,5] },
        ...baseData,
      ]
    }
    return baseData
  }, [start])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <WorkerNavbar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">In Progress</h1>
          <Link href="/worker/completed" className="text-sm text-emerald-600 hover:underline">Go to Completed</Link>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((t) => (
            <div key={t.id} className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">Started: {t.startDate}</div>
                <span className="text-xs font-medium text-blue-600">{t.progress}%</span>
              </div>
              <div className="mt-2 text-gray-900 dark:text-white font-medium">{t.title}</div>
              <div className="mt-3 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <div className="h-full bg-blue-600" style={{ width: `${t.progress}%` }} />
              </div>
              {Array.isArray((t as any).trend) && (t as any).trend.length > 1 && (
                <Sparkline values={(t as any).trend as number[]} />
              )}
              <div className="mt-4 flex justify-end gap-2">
                <Link href={{ pathname: '/worker/completed', query: { done: t.id } }} className="rounded-md bg-emerald-600 px-3 py-1.5 text-white text-sm hover:bg-emerald-500">Mark Completed</Link>
                <Link href={`/worker/assigned`} className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-900">Details</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
