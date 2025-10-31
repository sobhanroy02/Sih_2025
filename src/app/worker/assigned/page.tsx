"use client"

import React from 'react'
import Link from 'next/link'
import WorkerNavbar from '@/components/layout/WorkerNavbar'
import { Button } from '@/components/ui/Button'
import { assignedTasks } from '@/lib/mock-tasks'

export default function WorkerAssignedPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <WorkerNavbar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Assigned Tasks</h1>
          <Link href="/worker/in-progress" className="text-sm text-primary-600 hover:underline">Go to In Progress</Link>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/40">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {assignedTasks.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-900/40">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{t.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{t.description}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{t.assignedDate}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 px-2 py-0.5 text-xs font-medium">{t.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm">
                    <div className="flex justify-end gap-2">
                      <Link href={{ pathname: '/worker/in-progress', query: { start: t.id } }} className="rounded-md bg-primary-600 px-3 py-1.5 text-white text-sm hover:bg-primary-500">Start Task</Link>
                      <Link href={`/worker/assigned/${t.id}`} className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-900">View Details</Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
