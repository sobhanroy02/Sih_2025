"use client"

import React, { useMemo, useState } from 'react'
import WorkerNavbar from '@/components/layout/WorkerNavbar'
import { useWorkerTasksStore } from '@/store/workerTasks'

type Task = { id: string; title: string; completedDate: string }

const history: Task[] = [
  { id: 'T-0901', title: 'Tree Trimming - Central Ave', completedDate: '2025-09-28' },
  { id: 'T-0902', title: 'Road Patch - Oak St', completedDate: '2025-09-30' },
  { id: 'T-1004', title: 'Garbage Removal - Warehouse Ln', completedDate: '2025-10-03' },
]

export default function WorkerCompletedPage({ searchParams }: { searchParams?: { done?: string } }) {
  const [query, setQuery] = useState('')
  const { setProof, getProofsArray } = useWorkerTasksStore()
  const tasks = useMemo(() => {
    const merged = searchParams?.done
      ? [{ id: searchParams.done, title: `Task ${searchParams.done}`, completedDate: new Date().toISOString().slice(0,10) }, ...history]
      : history
    if (!query) return merged
    const q = query.toLowerCase()
    return merged.filter(t => t.title.toLowerCase().includes(q) || t.id.toLowerCase().includes(q))
  }, [query, searchParams?.done])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <WorkerNavbar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Completed Tasks</h1>
          <div className="relative w-full max-w-xs">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-3 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="mt-6 divide-y divide-gray-200 dark:divide-gray-800 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800">
          {tasks.map((t) => (
            <div key={t.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{t.title}</div>
                <div className="text-xs text-gray-500">Completed: {t.completedDate}</div>
              </div>
              <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 px-2 py-0.5 text-xs font-medium">Done</span>
            </div>
          ))}
          {tasks.length === 0 && (
            <div className="p-6 text-center text-sm text-gray-500">No tasks found.</div>
          )}
        </div>

        {/* Proof upload panel */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-5">
            <div className="text-sm font-semibold text-gray-900 dark:text-white">Upload Completion Proof</div>
            <p className="text-xs text-gray-500 mt-1">Select a completed task and upload a photo/video as proof.</p>
            <form
              className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center"
              onSubmit={(e) => {
                e.preventDefault()
                const form = e.currentTarget as HTMLFormElement
                const select = form.elements.namedItem('taskId') as HTMLSelectElement
                const input = form.elements.namedItem('file') as HTMLInputElement
                const file = input.files?.[0]
                if (!select?.value || !file) return
                const reader = new FileReader()
                reader.onload = () => {
                  const dataUrl = String(reader.result || '')
                  setProof({
                    taskId: select.value,
                    fileName: file.name,
                    dataUrl,
                    uploadedAt: new Date().toISOString(),
                  })
                  form.reset()
                }
                reader.readAsDataURL(file)
              }}
            >
              <select name="taskId" className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="">Select task</option>
                {tasks.map((t) => (
                  <option key={t.id} value={t.id}>{t.id} — {t.title}</option>
                ))}
              </select>
              <input name="file" type="file" accept="image/*,video/*" className="text-sm" />
              <button type="submit" className="rounded-lg bg-emerald-600 px-3 py-2 text-white text-sm hover:bg-emerald-500">Upload</button>
            </form>
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-5">
            <div className="text-sm font-semibold text-gray-900 dark:text-white">Recently Uploaded Proofs</div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {getProofsArray().map((p) => (
                <div key={p.taskId} className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.dataUrl} alt={p.fileName} className="h-32 w-full object-cover" />
                  <div className="px-3 py-2 text-xs text-gray-600 dark:text-gray-300">
                    <div className="font-medium text-gray-900 dark:text-white">{p.taskId}</div>
                    <div>{p.fileName}</div>
                    <div className="text-[10px]">{new Date(p.uploadedAt).toLocaleString()}</div>
                  </div>
                </div>
              ))}
              {getProofsArray().length === 0 && (
                <div className="text-sm text-gray-500">No proofs uploaded yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
