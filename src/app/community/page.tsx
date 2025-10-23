"use client"

import React, { useMemo, useState } from "react"
import CitizenNavbar from "@/components/layout/CitizenNavbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { useIssuesStore, type Issue, type IssueCategory, type IssueStatus } from "@/store"
import { cn } from "@/utils/cn"
import {
  FunnelIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ArrowUpRightIcon,
  ArrowTrendingUpIcon,
  CursorArrowRaysIcon,
} from "@heroicons/react/24/outline"
import { calculateDistance, formatDistance, getCurrentLocation } from "@/lib/geospatial"

type ViewMode = "grid" | "list"

export default function CommunityPage() {
  const { issues } = useIssuesStore()

  // Filters UI state
  const [query, setQuery] = useState("")
  const [keywords, setKeywords] = useState("")
    const [status, setStatus] = useState<IssueStatus | "">("")
    const [category, setCategory] = useState<IssueCategory | "">("")
  const [sortBy, setSortBy] = useState("newest") // newest | oldest | most | least | nearest
  const [applied, setApplied] = useState(false)
  const [view, setView] = useState<ViewMode>("grid")
  const [radius, setRadius] = useState<number>(5000) // in meters, default 5km
  const [locating, setLocating] = useState(false)
  const [currentLoc, setCurrentLoc] = useState<{ lat: number; lng: number } | null>(null)

  const categories: { value: IssueCategory; label: string }[] = [
    { value: "pothole", label: "Pothole / Road" },
    { value: "streetlight", label: "Streetlight" },
    { value: "garbage", label: "Garbage" },
    { value: "water", label: "Water" },
    { value: "graffiti", label: "Graffiti" },
    { value: "road", label: "Road" },
    { value: "other", label: "Other" },
  ]

  const statuses: { value: IssueStatus; label: string }[] = [
    { value: "open", label: "Open" },
    { value: "in-progress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
    { value: "closed", label: "Closed" },
  ]

  const results = useMemo(() => {
    const list = [...issues]
    const normalizedQuery = keywords.trim().toLowerCase()
    let filtered = list.filter((i) => {
      if (!applied && !normalizedQuery && !status && !category && !currentLoc) return true
      const matchesQuery = normalizedQuery
        ? i.title.toLowerCase().includes(normalizedQuery) ||
          i.description.toLowerCase().includes(normalizedQuery) ||
          i.location.address.toLowerCase().includes(normalizedQuery)
        : true
      const matchesStatus = status ? i.status === status : true
      const matchesCategory = category ? i.category === category : true
      const matchesLocation = currentLoc
        ? calculateDistance(
            currentLoc.lat,
            currentLoc.lng,
            i.location.coordinates.lat,
            i.location.coordinates.lng
          ) <= radius
        : query.trim().length
        ? i.location.address.toLowerCase().includes(query.trim().toLowerCase())
        : true

      return matchesQuery && matchesStatus && matchesCategory && matchesLocation
    })

    switch (sortBy) {
      case "oldest":
        filtered.sort((a, b) => a.reportedAt.getTime() - b.reportedAt.getTime())
        break
      case "most":
        filtered.sort((a, b) => b.upvotes - a.upvotes)
        break
      case "least":
        filtered.sort((a, b) => a.upvotes - b.upvotes)
        break
      case "nearest":
        if (currentLoc) {
          filtered.sort((a, b) =>
            calculateDistance(currentLoc.lat, currentLoc.lng, a.location.coordinates.lat, a.location.coordinates.lng) -
            calculateDistance(currentLoc.lat, currentLoc.lng, b.location.coordinates.lat, b.location.coordinates.lng)
          )
        } else {
          filtered.sort((a, b) => b.reportedAt.getTime() - a.reportedAt.getTime())
        }
        break
      case "newest":
      default:
        filtered.sort((a, b) => b.reportedAt.getTime() - a.reportedAt.getTime())
    }
    return filtered
  }, [issues, keywords, query, status, category, sortBy, applied, currentLoc, radius])

  return (
    <>
      <CitizenNavbar />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="rounded-2xl p-[1px] bg-gradient-to-br from-emerald-400/50 via-blue-400/40 to-cyan-400/50">
          <Card className="rounded-2xl bg-white/70 dark:bg-gray-900/60 backdrop-blur ring-1 ring-gray-200/60 dark:ring-white/10">
            <CardHeader className="px-6 pt-6 pb-3">
              <CardTitle className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 ring-1 ring-white/20 shadow-md">
                  <FunnelIcon className="h-4 w-4 text-white" />
                </span>
                <span>Community Issues</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
                {/* Location search */}
                <div className="lg:col-span-3">
                  <Input
                    label="Search by location"
                    placeholder="Enter area, landmark, or address"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="bg-white/95 dark:bg-gray-900/60"
                    leftIcon={<MapPinIcon className="h-4 w-4" />}
                  />
                </div>
                <div className="lg:col-span-2 flex items-end">
                  <Button
                    type="button"
                    className="w-full rounded-full bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={async () => {
                      try {
                        setLocating(true)
                        const loc = await getCurrentLocation()
                        setCurrentLoc({ lat: loc.latitude, lng: loc.longitude })
                        setApplied(true)
                      } catch (e) {
                        alert('Unable to get current location. Please allow location access.')
                      } finally {
                        setLocating(false)
                      }
                    }}
                    leftIcon={<CursorArrowRaysIcon className="h-5 w-5" />}
                    loading={locating}
                  >
                    Use current location
                  </Button>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Radius</label>
                  <select
                    className="h-10 w-full rounded-lg border border-gray-300 bg-white/80 px-3 text-sm dark:border-white/10 dark:bg-gray-900/50"
                    value={radius}
                    onChange={(e) => setRadius(Number(e.target.value))}
                  >
                    <option value={1000}>1 km</option>
                    <option value={3000}>3 km</option>
                    <option value={5000}>5 km</option>
                    <option value={10000}>10 km</option>
                    <option value={25000}>25 km</option>
                  </select>
                </div>

                {/* Keywords */}
                <div className="lg:col-span-3">
                  <Input
                    label="Keywords"
                    placeholder="Title or description keywords"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    className="bg-white/95 dark:bg-gray-900/60"
                    leftIcon={<MagnifyingGlassIcon className="h-4 w-4" />}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                  <select
                    className="h-10 w-full rounded-lg border border-gray-300 bg-white/80 px-3 text-sm dark:border-white/10 dark:bg-gray-900/50"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as IssueStatus | "")}
                  >
                    <option value="">Any</option>
                    {statuses.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                  <select
                    className="h-10 w-full rounded-lg border border-gray-300 bg-white/80 px-3 text-sm dark:border-white/10 dark:bg-gray-900/50"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as IssueCategory | "")}
                  >
                    <option value="">Any</option>
                    {categories.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Sort by</label>
                  <select
                    className="h-10 w-full rounded-lg border border-gray-300 bg-white/80 px-3 text-sm dark:border-white/10 dark:bg-gray-900/50"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="most">Most upvoted</option>
                    <option value="least">Least upvoted</option>
                    <option value="nearest">Nearest</option>
                  </select>
                </div>
                <div className="lg:col-span-6 flex items-center justify-end gap-3 pt-2">
                  {currentLoc && (
                    <span className="text-xs text-gray-600 dark:text-gray-300">
                      Location set • Radius {Math.round(radius/1000)}km
                    </span>
                  )}
                  <Button
                    type="button"
                    size="lg"
                    className="rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow-[0_10px_24px_-6px_rgba(37,99,235,0.55)] px-8"
                    onClick={() => setApplied(true)}
                    leftIcon={<MagnifyingGlassIcon className="h-5 w-5" />}
                  >
                    Find Issues
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results header */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <ArrowTrendingUpIcon className="h-4 w-4" />
            <span>{results.length} issue{results.length === 1 ? "" : "s"} {applied || query || status || category ? "found" : "in community"}</span>
          </div>
          <div className="inline-flex rounded-full border border-gray-200 bg-white p-1 text-sm dark:border-white/10 dark:bg-gray-900">
            <button
              type="button"
              onClick={() => setView("grid")}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 transition ${view === "grid" ? "bg-blue-600 text-white shadow" : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
              aria-pressed={view === "grid"}
            >
              <Squares2X2Icon className="h-4 w-4" /> Grid
            </button>
            <button
              type="button"
              onClick={() => setView("list")}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 transition ${view === "list" ? "bg-blue-600 text-white shadow" : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
              aria-pressed={view === "list"}
            >
              <ListBulletIcon className="h-4 w-4" /> List
            </button>
          </div>
        </div>

        {/* Results */}
        {view === "grid" ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {results.map((issue) => (
              <IssueRow key={issue.id} issue={issue} />
            ))}
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

function IssueCard({ issue }: { issue: Issue }) {
  const statusClasses = getStatusClasses(issue.status)
  return (
    <Card className={cn(
      "rounded-2xl p-0 overflow-hidden",
      statusClasses.card
    )}>
      <div className="p-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-2">{issue.title}</h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{issue.description}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Pill>{issue.category}</Pill>
          <Pill>
            <span className={statusClasses.pillDot} aria-hidden>●</span>
            <span className="ml-1">Status: {issue.status}</span>
          </Pill>
          <Pill>Upvotes: {issue.upvotes}</Pill>
        </div>
        <IssueLocation address={issue.location.address} lat={issue.location.coordinates.lat} lng={issue.location.coordinates.lng} />
      </div>
      <div className="border-t border-gray-100 px-4 py-3 dark:border-white/10">
        <Button variant="ghost" size="sm" className="rounded-full">
          View Details
          <ArrowUpRightIcon className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </Card>
  )
}

function IssueRow({ issue }: { issue: Issue }) {
  const statusClasses = getStatusClasses(issue.status)
  return (
    <Card className={cn("p-0 overflow-hidden", statusClasses.row)}>
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">{issue.title}</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{issue.description}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Pill>{issue.category}</Pill>
            <Pill>
              <span className={statusClasses.pillDot} aria-hidden>●</span>
              <span className="ml-1">Status: {issue.status}</span>
            </Pill>
            <Pill>Upvotes: {issue.upvotes}</Pill>
            <IssueLocation address={issue.location.address} lat={issue.location.coordinates.lat} lng={issue.location.coordinates.lng} inline />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="rounded-full">
            View Details <ArrowUpRightIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}

// Status-based style helpers
function getStatusClasses(status: IssueStatus) {
  switch (status) {
    case "open":
      return {
        card: "bg-blue-50 dark:bg-blue-900/15 border border-blue-200 dark:border-blue-800 ring-1 ring-blue-200/50",
        row: "border border-blue-200 dark:border-blue-800",
        pillDot: "text-blue-500",
      }
    case "in-progress":
      return {
        card: "bg-amber-50 dark:bg-amber-900/15 border border-amber-200 dark:border-amber-800 ring-1 ring-amber-200/50",
        row: "border border-amber-200 dark:border-amber-800",
        pillDot: "text-amber-500",
      }
    case "resolved":
      return {
        card: "bg-emerald-50 dark:bg-emerald-900/15 border border-emerald-200 dark:border-emerald-800 ring-1 ring-emerald-200/50",
        row: "border border-emerald-200 dark:border-emerald-800",
        pillDot: "text-emerald-600",
      }
    case "closed":
    default:
      return {
        card: "bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 ring-1 ring-gray-200/50",
        row: "border border-gray-200 dark:border-gray-700",
        pillDot: "text-gray-500",
      }
  }
}

function IssueLocation({ address, lat, lng, inline }: { address: string; lat: number; lng: number; inline?: boolean }) {
  // Access current location from a higher scope via window global (simple approach) is not ideal; instead, we display only address and calculate distance on the fly using navigator if available
  const [nearby, setNearby] = React.useState<string | null>(null)
  React.useEffect(() => {
    let cancelled = false
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        if (cancelled) return
        const d = calculateDistance(pos.coords.latitude, pos.coords.longitude, lat, lng)
        setNearby(formatDistance(d))
      })
    }
    return () => {
      cancelled = true
    }
  }, [lat, lng])

  const content = (
    <span className="text-xs text-gray-500 dark:text-gray-400 inline-flex items-center gap-1">
      <MapPinIcon className="h-4 w-4" /> {address}
      {nearby && <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-700 ring-1 ring-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:ring-white/10">{nearby} away</span>}
    </span>
  )

  if (inline) return content
  return <div className="mt-3">{content}</div>
}
