"use client"

import React from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import CitizenNavbar from "@/components/layout/CitizenNavbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { useIssuesStore, type Issue, type IssueStatus } from "@/store"
import { MapPinIcon, ArrowLeftIcon, CheckCircleIcon } from "@heroicons/react/24/outline"

export default function IssueDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { issues } = useIssuesStore()
  const issue = issues.find((i) => i.id === params.id)

  return (
    <>
      <CitizenNavbar />
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="rounded-full" onClick={() => router.back()}>
              <ArrowLeftIcon className="h-4 w-4" /> Back
            </Button>
            <h1 className="text-xl sm:text-2xl font-heading font-bold text-slate-800">Issue Details</h1>
          </div>
          <Link href="/community" className="inline-flex">
            <Button className="rounded-full bg-blue-600 text-white hover:bg-blue-700">Community</Button>
          </Link>
        </div>

        {!issue ? (
          <Card>
            <CardContent className="p-8 text-center text-slate-600 dark:text-slate-300">
              Issue not found.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="rounded-2xl p-[1px] bg-gradient-to-br from-emerald-400/50 via-blue-400/40 to-cyan-400/50">
              <Card className="rounded-2xl bg-white/70 dark:bg-gray-900/60 backdrop-blur ring-1 ring-gray-200/60 dark:ring-white/10">
                <CardHeader className="px-6 pt-6 pb-2">
                  <CardTitle className="text-lg sm:text-xl">{issue.title}</CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <p className="text-sm text-slate-700 dark:text-slate-300">{issue.description}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                    <Pill>Category: {issue.category}</Pill>
                    <Pill>Priority: {issue.priority}</Pill>
                    <Pill>Status: {issue.status}</Pill>
                    <Pill>Upvotes: {issue.upvotes}</Pill>
                  </div>
                  <div className="mt-3 inline-flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <MapPinIcon className="h-4 w-4" /> {issue.location.address}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Simple progress section */}
            <Card className="rounded-2xl">
              <CardHeader className="px-6 pt-6 pb-2">
                <CardTitle className="text-base">Progress</CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <Progress status={issue.status} />
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </>
  )
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 ring-1 ring-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:ring-white/10">
      {children}
    </span>
  )
}

function Progress({ status }: { status: IssueStatus }) {
  const steps: { key: IssueStatus; label: string }[] = [
    { key: "open", label: "Open" },
    { key: "in-progress", label: "In Progress" },
    { key: "resolved", label: "Resolved" },
    { key: "closed", label: "Closed" },
  ]

  const idx = steps.findIndex((s) => s.key === status)

  return (
    <div className="flex flex-col gap-4">
      <div className="relative h-2 rounded-full bg-gray-200 dark:bg-gray-800">
        <div
          className="absolute left-0 top-0 h-2 rounded-full bg-blue-500"
          style={{ width: `${(Math.max(0, idx) / (steps.length - 1)) * 100}%` }}
        />
      </div>
      <div className="grid grid-cols-4 text-xs text-slate-600 dark:text-slate-300">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center gap-1">
            <CheckCircleIcon className={cnIcon(i <= idx)} /> {s.label}
          </div>
        ))}
      </div>
    </div>
  )
}

function cnIcon(active: boolean) {
  return active ? "h-4 w-4 text-emerald-600" : "h-4 w-4 text-gray-400"
}
