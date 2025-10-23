"use client"

import React from "react"
import CitizenNavbar from "@/components/layout/CitizenNavbar"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { useAuthStore, useIssuesStore, type Issue, type IssueStatus } from "@/store"
import { cn } from "@/utils/cn"
import {
  CheckBadgeIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  UserCircleIcon,
  ArrowUpRightIcon,
  CameraIcon,
} from "@heroicons/react/24/outline"

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore()
  const { issues } = useIssuesStore()
  const [isEditing, setIsEditing] = React.useState(false)
  const fileRef = React.useRef<HTMLInputElement | null>(null)
  const onAvatarPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = String(reader.result || "")
      updateUser({ avatar: dataUrl })
    }
    reader.readAsDataURL(file)
  }
  const [form, setForm] = React.useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    municipality: user?.municipality || "",
    city: user?.city || "",
    ward: user?.ward || "",
    department: user?.department || "",
  })

  React.useEffect(() => {
    setForm({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      municipality: user?.municipality || "",
      city: user?.city || "",
      ward: user?.ward || "",
      department: user?.department || "",
    })
  }, [user])

  const onSave = () => {
    updateUser({
      name: form.name.trim() || user?.name,
      email: form.email.trim() || user?.email,
      phone: form.phone.trim() || undefined,
      municipality: form.municipality.trim() || undefined,
      city: form.city.trim() || undefined,
      ward: form.ward.trim() || undefined,
      department: form.department.trim() || undefined,
    })
    setIsEditing(false)
  }

  // Fallback to demo user ID if not logged in so the page has meaningful content
  const effectiveUserId = user?.id ?? "user1"
  const myIssues = issues.filter((i) => i.reportedBy === effectiveUserId)
  const stats = React.useMemo(() => {
    const total = myIssues.length
    const open = myIssues.filter((i) => i.status === "open").length
    const inProgress = myIssues.filter((i) => i.status === "in-progress").length
    const resolved = myIssues.filter((i) => i.status === "resolved").length
    const closed = myIssues.filter((i) => i.status === "closed").length
    const upvotes = myIssues.reduce((acc, i) => acc + (i.upvotes || 0), 0)
    return { total, open, inProgress, resolved, closed, upvotes }
  }, [myIssues])

  return (
    <>
      <CitizenNavbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-800">User Profile</h1>
          <p className="mt-2 text-sm text-slate-600">Manage your details and track your submitted reports.</p>
        </div>

        {/* User details */}
        <div className="rounded-2xl p-[1px] bg-gradient-to-br from-emerald-400/50 via-blue-400/40 to-cyan-400/50">
          <Card className="rounded-2xl bg-white/70 dark:bg-gray-900/60 backdrop-blur ring-1 ring-gray-200/60 dark:ring-white/10">
            <CardContent className="p-6">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                {/* Avatar */}
                <div className="flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="group relative h-20 w-20 sm:h-24 sm:w-24 rounded-full ring-2 ring-white shadow-md overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                    aria-label="Change profile picture"
                    title="Change profile picture"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={user?.avatar || "/icons/icon-128x128.png"}
                      alt="User avatar"
                      className="h-full w-full object-cover"
                    />
                    <span className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/35 transition" />
                    <span className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2 py-1 text-[10px] font-medium text-slate-800 ring-1 ring-white/60">
                        <CameraIcon className="h-3.5 w-3.5" /> Change
                      </span>
                    </span>
                  </button>
                  <input ref={fileRef} onChange={onAvatarPick} type="file" accept="image/*" hidden />
                </div>
                {/* Info */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
                      {user?.name || "Demo User"}
                    </h2>
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:ring-blue-800">
                      {user?.role || "citizen"}
                    </span>
                    {user?.verified && (
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:ring-emerald-800">
                        <CheckBadgeIcon className="mr-1 h-4 w-4" /> Verified
                      </span>
                    )}
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <div className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <EnvelopeIcon className="h-4 w-4" />
                      <span>{user?.email || "demo@citizen.app"}</span>
                    </div>
                    <div className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <PhoneIcon className="h-4 w-4" />
                      <span>{user?.phone || "+91 99999 99999"}</span>
                    </div>
                    <div className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <MapPinIcon className="h-4 w-4" />
                      <span>
                        {(user?.municipality || "Municipality")} • {(user?.city || "City")}
                        {user?.ward ? ` • Ward ${user.ward}` : ""}
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <UserCircleIcon className="h-4 w-4" />
                      <span>{user?.department ? `Department: ${user.department}` : "Department: —"}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button onClick={() => setIsEditing(true)} className="rounded-full bg-blue-600 text-white hover:bg-blue-700">Edit Profile</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {isEditing && (
          <div className="mt-6 rounded-2xl p-[1px] bg-gradient-to-br from-blue-400/40 via-indigo-400/30 to-emerald-400/40">
            <Card className="rounded-2xl bg-white/80 dark:bg-gray-900/70 backdrop-blur ring-1 ring-gray-200/60 dark:ring-white/10">
              <CardHeader>
                <CardTitle className="text-base">Edit Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input label="Full Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                  <Input label="Email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
                  <Input label="Phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
                  <Input label="Municipality" value={form.municipality} onChange={(e) => setForm((f) => ({ ...f, municipality: e.target.value }))} />
                  <Input label="City" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} />
                  <Input label="Ward" value={form.ward} onChange={(e) => setForm((f) => ({ ...f, ward: e.target.value }))} />
                  <Input label="Department" value={form.department} onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))} />
                </div>
                <div className="flex items-center gap-3">
                  <Button onClick={onSave} className="rounded-full bg-emerald-600 text-white hover:bg-emerald-700">Save Changes</Button>
                  <Button variant="ghost" className="rounded-full" onClick={() => setIsEditing(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick stats */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Reports" value={stats.total} tone="slate" />
          <StatCard label="Open" value={stats.open} tone="blue" />
          <StatCard label="In Progress" value={stats.inProgress} tone="amber" />
          <StatCard label="Resolved" value={stats.resolved} tone="emerald" />
          {/* Optional extra: closed and upvotes shown compactly on wide screens */}
          <StatCard label="Closed" value={stats.closed} tone="gray" className="hidden lg:block" />
          <StatCard label="Total Upvotes" value={stats.upvotes} tone="indigo" className="hidden lg:block" />
        </div>

        {/* My issues */}
        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Your Reports</h3>
            <span className="text-sm text-slate-600 dark:text-slate-300">{myIssues.length} total</span>
          </div>

          {myIssues.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {myIssues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}

function StatCard({ label, value, tone = "slate", className = "" }: { label: string; value: number | string; tone?: "slate" | "blue" | "amber" | "emerald" | "gray" | "indigo"; className?: string }) {
  const tones: Record<string, { bg: string; ring: string; text: string }> = {
    slate: { bg: "bg-slate-50 dark:bg-slate-800/40", ring: "ring-slate-200/60 dark:ring-white/10", text: "text-slate-900 dark:text-white" },
    blue: { bg: "bg-blue-50 dark:bg-blue-900/15", ring: "ring-blue-200/60 dark:ring-blue-800/50", text: "text-blue-900 dark:text-blue-100" },
    amber: { bg: "bg-amber-50 dark:bg-amber-900/15", ring: "ring-amber-200/60 dark:ring-amber-800/50", text: "text-amber-900 dark:text-amber-100" },
    emerald: { bg: "bg-emerald-50 dark:bg-emerald-900/15", ring: "ring-emerald-200/60 dark:ring-emerald-800/50", text: "text-emerald-900 dark:text-emerald-100" },
    gray: { bg: "bg-gray-50 dark:bg-gray-800/40", ring: "ring-gray-200/60 dark:ring-white/10", text: "text-gray-900 dark:text-gray-100" },
    indigo: { bg: "bg-indigo-50 dark:bg-indigo-900/15", ring: "ring-indigo-200/60 dark:ring-indigo-800/50", text: "text-indigo-900 dark:text-indigo-100" },
  }
  const t = tones[tone]
  return (
    <div className={cn("rounded-2xl p-[1px]", className)}>
      <div className={cn("rounded-2xl backdrop-blur ring-1 p-4", t.bg, t.ring)}>
        <div className="text-xs tracking-wide text-slate-600 dark:text-slate-300">{label}</div>
        <div className={cn("mt-1 text-2xl font-semibold", t.text)}>{value}</div>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="rounded-2xl p-[1px] bg-gradient-to-br from-gray-200/50 via-gray-200/40 to-gray-200/50 dark:from-gray-700/30 dark:via-gray-700/20 dark:to-gray-700/30">
      <Card className="rounded-2xl bg-white/70 dark:bg-gray-900/60 backdrop-blur ring-1 ring-gray-200/60 dark:ring-white/10">
        <CardContent className="p-8 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-300">You haven’t submitted any issues yet.</p>
          <div className="mt-4">
            <Link href="/report" className="inline-flex">
              <Button className="rounded-full bg-emerald-600 text-white hover:bg-emerald-700">Report an Issue</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function IssueCard({ issue }: { issue: Issue }) {
  const statusClasses = getStatusClasses(issue.status)
  return (
    <Card className={cn("rounded-2xl p-0 overflow-hidden", statusClasses.card)}>
      <div className="p-4">
        <h4 className="text-base font-semibold text-slate-900 dark:text-white line-clamp-2">{issue.title}</h4>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 line-clamp-3">{issue.description}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Pill>{issue.category}</Pill>
          <Pill>
            <span className={statusClasses.pillDot} aria-hidden>●</span>
            <span className="ml-1">{issue.status}</span>
          </Pill>
          <Pill>Upvotes: {issue.upvotes}</Pill>
        </div>
        <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 inline-flex items-center gap-1">
          <MapPinIcon className="h-4 w-4" /> {issue.location.address}
        </div>
      </div>
      <div className="border-t border-gray-100 px-4 py-3 dark:border-white/10">
        <Link href={`/issue/${issue.id}`} className="inline-flex">
          <Button variant="ghost" size="sm" className="rounded-full">
            Track Status <ArrowUpRightIcon className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </Card>
  )
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 ring-1 ring-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:ring-white/10">
      {children}
    </span>
  )
}

function getStatusClasses(status: IssueStatus) {
  switch (status) {
    case "open":
      return {
        card: "bg-blue-50 dark:bg-blue-900/15 border border-blue-200 dark:border-blue-800 ring-1 ring-blue-200/50",
        pillDot: "text-blue-500",
      }
    case "in-progress":
      return {
        card: "bg-amber-50 dark:bg-amber-900/15 border border-amber-200 dark:border-amber-800 ring-1 ring-amber-200/50",
        pillDot: "text-amber-500",
      }
    case "resolved":
      return {
        card: "bg-emerald-50 dark:bg-emerald-900/15 border border-emerald-200 dark:border-emerald-800 ring-1 ring-emerald-200/50",
        pillDot: "text-emerald-600",
      }
    case "closed":
    default:
      return {
        card: "bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 ring-1 ring-gray-200/50",
        pillDot: "text-gray-500",
      }
  }
}
