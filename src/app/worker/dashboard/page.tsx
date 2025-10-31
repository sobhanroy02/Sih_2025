"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import WorkerNavbar from '@/components/layout/WorkerNavbar'
import { useAuthStore } from '@/store'
import { Card, CardContent } from '@/components/ui/Card'
import { getTaskCounts } from '@/lib/mock-tasks'

function Donut({ values }: { values: { label: string; value: number; color: string }[] }) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)
  const total = Math.max(1, values.reduce((a, b) => a + b.value, 0))
  const completed = values.find(v => v.label.toLowerCase().includes('completed'))?.value ?? 0
  const completedPct = Math.round((completed / total) * 100)

  const size = 200
  const baseStroke = 22
  const strokeGap = 2 // small visual gap between segments
  const radius = (size - baseStroke) / 2
  const circumference = 2 * Math.PI * radius
  const gapLen = (strokeGap / (2 * Math.PI * radius)) * circumference // convert px gap to path len

  let offset = 0

  return (
    <div className="flex items-center gap-6">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* background ring */}
        <circle r={radius} cx={size/2} cy={size/2} fill="transparent" stroke="#E5E7EB" strokeWidth={baseStroke} />
        <g transform={`rotate(-90 ${size/2} ${size/2})`}>
          {values.map((v, i) => {
            const highlight = hoverIdx === i
            const stroke = highlight ? baseStroke + 2 : baseStroke
            const len = (v.value/total) * circumference
            const draw = Math.max(0, len - gapLen) // leave tiny gap
            const el = (
              <circle
                key={v.label}
                r={radius}
                cx={size/2}
                cy={size/2}
                fill="transparent"
                stroke={v.color}
                strokeLinecap="round"
                strokeWidth={stroke}
                strokeDasharray={`${draw} ${circumference-draw}`}
                strokeDashoffset={-(offset)}
                style={{ transition: 'stroke-dasharray 600ms ease, stroke-width 200ms ease', filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.15))' }}
              />
            )
            offset += len
            return el
          })}
        </g>
        {/* center labels */}
        <text x="50%" y="48%" dominantBaseline="middle" textAnchor="middle" className="fill-slate-900 dark:fill-slate-100" style={{ fontSize: 22, fontWeight: 800 }}>{completedPct}%</text>
        <text x="50%" y="60%" dominantBaseline="middle" textAnchor="middle" className="fill-slate-500 dark:fill-slate-300" style={{ fontSize: 11, fontWeight: 600 }}>Completed</text>
      </svg>
      {/* Legend */}
      <ul className="space-y-2 text-xs">
        {values.map((v, i) => (
          <li
            key={v.label}
            onMouseEnter={() => setHoverIdx(i)}
            onMouseLeave={() => setHoverIdx(null)}
            className={`flex items-center justify-between gap-3 rounded-lg border px-2 py-1.5 transition ${hoverIdx===i ? 'border-slate-300 bg-slate-50 dark:bg-slate-800/60 dark:border-slate-700' : 'border-transparent'}`}
          >
            <span className="inline-flex items-center gap-2">
              <i className="h-2 w-2 rounded-sm" style={{ background: v.color }} />
              <span className="text-gray-700 dark:text-gray-300">{v.label}</span>
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">{v.value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function WorkerDashboardPage() {
  const { user } = useAuthStore()

  const profile = {
    name: user?.name || 'Worker',
    email: user?.email || 'worker@example.com',
    role: 'Worker',
    avatar: user?.avatar || '/icons/icon-128x128.png',
    municipality: user?.municipality || '—',
    city: user?.city || '—',
    ward: user?.ward || '—',
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <WorkerNavbar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Worker Dashboard</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Welcome back! Manage your assignments and track progress.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/worker/assigned" className="rounded-lg px-3 py-2 bg-primary-600 text-white text-sm font-medium hover:bg-primary-500">View Assigned</Link>
            <Link href="/worker/in-progress" className="rounded-lg px-3 py-2 bg-blue-600 text-white text-sm font-medium hover:bg-blue-500">In Progress</Link>
            <Link href="/worker/completed" className="rounded-lg px-3 py-2 bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500">Completed</Link>
          </div>
        </div>

        {/* Profile Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Card className="md:col-span-1">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={profile.avatar} alt={profile.name} className="h-16 w-16 rounded-full object-cover" />
                <div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">{profile.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{profile.email}</div>
                  <div className="mt-1 inline-flex items-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 px-2 py-0.5 text-xs font-medium">{profile.role}</div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                {(() => {
                  const c = getTaskCounts()
                  return (
                    <>
                      <div className="rounded-lg bg-white dark:bg-gray-800 p-3 border border-gray-100 dark:border-gray-800">
                        <div className="text-xl font-bold text-gray-900 dark:text-white">{c.assigned}</div>
                        <div className="text-[11px] text-gray-500">Assigned</div>
                      </div>
                      <div className="rounded-lg bg-white dark:bg-gray-800 p-3 border border-gray-100 dark:border-gray-800">
                        <div className="text-xl font-bold text-gray-900 dark:text-white">{c.inProgress}</div>
                        <div className="text-[11px] text-gray-500">In Progress</div>
                      </div>
                      <div className="rounded-lg bg-white dark:bg-gray-800 p-3 border border-gray-100 dark:border-gray-800">
                        <div className="text-xl font-bold text-gray-900 dark:text-white">{c.completed}</div>
                        <div className="text-[11px] text-gray-500">Completed</div>
                      </div>
                    </>
                  )
                })()}
              </div>
            </CardContent>
          </Card>

          {/* Quick links */}
          <Card className="md:col-span-2">
            <CardContent className="p-5">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">Quick Links</h2>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link href="/worker/assigned" className="group rounded-xl border border-emerald-200/40 bg-white/60 dark:bg-gray-800 p-4 hover:shadow transition">
                  <div className="font-medium text-gray-900 dark:text-white">Assigned Tasks</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Start work on new assignments.</p>
                </Link>
                <Link href="/worker/in-progress" className="group rounded-xl border border-blue-200/40 bg-white/60 dark:bg-gray-800 p-4 hover:shadow transition">
                  <div className="font-medium text-gray-900 dark:text-white">In Progress</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Update status and timelines.</p>
                </Link>
                <Link href="/worker/completed" className="group rounded-xl border border-emerald-200/40 bg-white/60 dark:bg-gray-800 p-4 hover:shadow transition">
                  <div className="font-medium text-gray-900 dark:text-white">Completed</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Review past work and history.</p>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status distribution donut */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-5">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">Task Status Distribution</h2>
              {(() => {
                const c = getTaskCounts()
                const values = [
                  { label: 'Assigned', value: c.assigned, color: '#F59E0B' },
                  { label: 'In Progress', value: c.inProgress, color: '#3B82F6' },
                  { label: 'Completed', value: c.completed, color: '#10B981' },
                ]
                return <div className="mt-3"><Donut values={values} /></div>
              })()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
