"use client"

import React, { useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import CitizenNavbar from '@/components/layout/CitizenNavbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import {
  useAuthStore,
  useIssuesStore,
  useNotificationsStore,
  type Issue,
  type IssueCategory,
  type IssuePriority,
} from '@/store'
import {
  ExclamationTriangleIcon,
  LightBulbIcon,
  TrashIcon,
  BeakerIcon,
  BoltIcon,
  ShieldExclamationIcon,
  EllipsisHorizontalCircleIcon,
  PhotoIcon,
  FilmIcon,
  MapPinIcon,
  ClipboardDocumentCheckIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline'

type Severity = 'Low' | 'Medium' | 'High' | 'Critical'

type MediaItem = {
  file: File
  url: string
  kind: 'image' | 'video'
}

export default function ReportPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { addIssue } = useIssuesStore()
  const { addNotification } = useNotificationsStore()
  // Form state
  const [category, setCategory] = useState<string>('Pothole / Road Damage')
  const [customCategory, setCustomCategory] = useState('')
  const [media, setMedia] = useState<MediaItem[]>([])
  const [address, setAddress] = useState('')
  const [coords, setCoords] = useState<{ lat: number | null; lng: number | null }>({ lat: null, lng: null })
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [severity, setSeverity] = useState<Severity>('Medium')
  const [confirmed, setConfirmed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [createdId, setCreatedId] = useState<string | null>(null)
  const photoCaptureRef = useRef<HTMLInputElement | null>(null)
  const videoCaptureRef = useRef<HTMLInputElement | null>(null)

  const categories = useMemo(
    () => [
      { name: 'Pothole / Road Damage', icon: ExclamationTriangleIcon },
      { name: 'Street Light Issue', icon: LightBulbIcon },
      { name: 'Garbage / Waste', icon: TrashIcon },
      { name: 'Water Leakage', icon: BeakerIcon },
      { name: 'Power Outage', icon: BoltIcon },
      { name: 'Public Safety', icon: ShieldExclamationIcon },
      { name: 'Other', icon: EllipsisHorizontalCircleIcon },
    ],
    []
  )

  function onSelectFiles(files: FileList | null) {
    if (!files) return
    const items: MediaItem[] = []
    for (const file of Array.from(files)) {
      const url = URL.createObjectURL(file)
      const kind = file.type.startsWith('video') ? 'video' : 'image'
      items.push({ file, url, kind })
    }
    setMedia((prev) => [...prev, ...items])
  }

  async function useCurrentLocation() {
    if (!('geolocation' in navigator)) return alert('Geolocation is not supported on this browser.')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
      },
      (err) => {
        alert('Could not fetch location: ' + err.message)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  function removeMedia(url: string) {
    setMedia((prev) => prev.filter((m) => m.url !== url))
  }

  function onCaptureChange(e: React.ChangeEvent<HTMLInputElement>) {
    onSelectFiles(e.target.files)
    // reset to allow selecting the same file again
    try { if (e.target) (e.target as HTMLInputElement).value = '' } catch {}
  }

  // Relaxed validation for smooth demo flow: location optional
  const canSubmit =
    title.trim().length > 2 &&
    description.trim().length > 10 &&
    confirmed &&
    !submitting

  const missingHints: string[] = []
  if (title.trim().length <= 2) missingHints.push('Title is too short')
  if (description.trim().length <= 10) missingHints.push('Description needs more details')
  if (!confirmed) missingHints.push('Please confirm the details are genuine')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)

    try {
      // 1) Build a local Issue object and save to the store (no auth required)
      const id = genReportId()
      const images = media.filter(m => m.kind === 'image').map(m => m.url)
      const normalizedCategory = normalizeCategory(category, customCategory)
      const priority = (severity.toLowerCase() as IssuePriority)

      const newIssue: Issue = {
        id,
        title: title.trim(),
        description: description.trim(),
        category: normalizedCategory,
        priority,
        status: 'open',
        location: {
          address: (address.trim() || 'Location based on coordinates'),
          coordinates: {
            lat: coords.lat || 0,
            lng: coords.lng || 0,
          },
        },
        images,
        reportedBy: user?.id ?? 'user1',
        reportedAt: new Date(),
        updatedAt: new Date(),
        upvotes: 0,
        comments: [],
      }

      addIssue(newIssue)
      setCreatedId(id)
      setSubmitted(true)

      // 2) Optional: try background API submit (will be skipped if not authenticated)
      ;(async () => {
        try {
          // Skip hitting protected endpoints in demo mode; integrate Supabase later.
          // Keeping this comment for future backend wiring.
        } catch {}
      })()

      // 3) Notify user
      addNotification({
        type: 'success',
        title: 'Report submitted',
        message: 'Your issue has been recorded and is visible to admins.',
      })
    } catch (err) {
      console.error('Error submitting report (local):', err)
      addNotification({ type: 'error', title: 'Submit failed', message: 'Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <CitizenNavbar />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Top row: heading + hero copy (left), empty right to keep balance like home */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <section className="lg:col-span-7">
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-800">
              Report an Issue
            </h1>
            <p className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
              Help improve your community.
            </p>
            <p className="mt-4 max-w-2xl text-slate-600">
              Help improve your community by reporting civic issues. Your reports help local authorities respond faster and more effectively.
            </p>
          </section>
          <aside className="lg:col-span-5 hidden lg:block">
            <div className="relative h-40 rounded-2xl overflow-hidden ring-1 ring-blue-200/60 shadow-sm bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/source.png" alt="City illustration" className="object-cover object-center w-full h-full" />
            </div>
          </aside>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 mt-8">
          {/* Left: form box (max half of the website) */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl p-[1px] bg-gradient-to-br from-emerald-400/50 via-blue-400/40 to-cyan-400/50">
              <Card className="rounded-2xl bg-white/70 dark:bg-gray-900/60 backdrop-blur ring-1 ring-gray-200/60 dark:ring-white/10">
                <CardHeader className="p-6 pb-2">
                  <CardTitle className="text-lg font-semibold">Submit your report</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-4">
                  <form onSubmit={onSubmit} className="space-y-6 max-w-2xl">
                    {/* Issue Category */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-white">
                        Issue Category
                      </label>
                      <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {categories.map(({ name, icon: Icon }) => {
                          const selected = category === name
                          return (
                            <button
                              type="button"
                              key={name}
                              onClick={() => setCategory(name)}
                              className={`group relative rounded-xl p-3 text-left ring-1 transition-all
                                ${selected ? 'bg-emerald-50/70 dark:bg-emerald-900/20 ring-emerald-300' : 'bg-white/60 dark:bg-gray-900/40 ring-gray-200/60 dark:ring-white/10 hover:bg-white/80'}
                              `}
                            >
                              <div className="flex items-center gap-3">
                                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 ring-1 ring-white/20 shadow">
                                  <Icon className="h-5 w-5 text-white" />
                                </span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">{name}</span>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                      {category === 'Other' && (
                        <input
                          type="text"
                          placeholder="Specify other issue"
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                          className="mt-3 w-full rounded-lg border border-gray-200/60 dark:border-white/10 bg-white/70 dark:bg-gray-900/60 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                        />
                      )}
                    </div>

                    {/* Photo Evidence */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-white">
                        Photo Evidence
                      </label>
                      <div className="mt-3 rounded-xl border border-dashed border-gray-300 dark:border-white/20 p-4 bg-white/50 dark:bg-gray-900/40">
                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                          <PhotoIcon className="h-5 w-5" />
                          <span>Upload photos or videos that clearly show the issue.</span>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          <input
                            id="media"
                            type="file"
                            accept="image/*,video/*"
                            multiple
                            onChange={(e) => onSelectFiles(e.target.files)}
                            className="block w-full text-sm file:mr-3 file:rounded-lg file:border file:border-gray-200/60 file:bg-white/80 file:px-3 file:py-2 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-white"
                          />
                          <span className="text-xs text-gray-500">or</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => photoCaptureRef.current?.click()}
                            leftIcon={<PhotoIcon className="h-4 w-4" />}
                          >
                            Take Photo
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => videoCaptureRef.current?.click()}
                            leftIcon={<FilmIcon className="h-4 w-4" />}
                          >
                            Record Video
                          </Button>
                          {/* Hidden capture inputs for mobile cameras */}
                          <input
                            ref={photoCaptureRef}
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={onCaptureChange}
                            hidden
                          />
                          <input
                            ref={videoCaptureRef}
                            type="file"
                            accept="video/*"
                            capture
                            onChange={onCaptureChange}
                            hidden
                          />
                        </div>
                        {media.length > 0 && (
                          <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-3">
                            {media.map((m) => (
                              <div key={m.url} className="relative group rounded-lg overflow-hidden ring-1 ring-gray-200/60 dark:ring-white/10">
                                {m.kind === 'image' ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={m.url} alt="preview" className="h-24 w-full object-cover" />
                                ) : (
                                  <video src={m.url} className="h-24 w-full object-cover" />
                                )}
                                <button
                                  type="button"
                                  onClick={() => removeMedia(m.url)}
                                  className="absolute top-1 right-1 rounded-full bg-white/80 dark:bg-gray-900/70 px-2 py-0.5 text-xs ring-1 ring-gray-200/60 dark:ring-white/10 hover:bg-white"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-white">
                        Location
                      </label>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <Button
                          type="button"
                          onClick={useCurrentLocation}
                          variant="gradient"
                          className="justify-center"
                          leftIcon={<MapPinIcon className="h-4 w-4" />}
                        >
                          Use current location
                        </Button>
                        <input
                          type="text"
                          placeholder="Enter address or landmark"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="rounded-lg border border-gray-200/60 dark:border-white/10 bg-white/70 dark:bg-gray-900/60 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                        />
                      </div>
                      {(coords.lat && coords.lng) && (
                        <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                          Coordinates: {coords.lat?.toFixed(5)}, {coords.lng?.toFixed(5)}
                        </p>
                      )}
                    </div>

                    {/* Issue Details */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-white">
                        Issue Details
                      </label>
                      <div className="mt-3 grid gap-3">
                        <input
                          type="text"
                          placeholder="Issue title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="rounded-lg border border-gray-200/60 dark:border-white/10 bg-white/70 dark:bg-gray-900/60 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                        />
                        <textarea
                          placeholder="Describe the issue in detail"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows={4}
                          className="rounded-lg border border-gray-200/60 dark:border-white/10 bg-white/70 dark:bg-gray-900/60 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                        />
                      </div>
                    </div>

                    {/* Severity */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-white">
                        Severity Level
                      </label>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(['Low', 'Medium', 'High', 'Critical'] as Severity[]).map((lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => setSeverity(lvl)}
                            className={`rounded-full px-3 py-1.5 text-sm ring-1 transition ${
                              severity === lvl
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white ring-white/20'
                                : 'bg-white/70 dark:bg-gray-900/50 text-gray-700 dark:text-gray-300 ring-gray-200/60 dark:ring-white/10 hover:bg-white'
                            }`}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Confirmation */}
                    <div className="flex items-start gap-3">
                      <input
                        id="confirm"
                        type="checkbox"
                        checked={confirmed}
                        onChange={(e) => setConfirmed(e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <label htmlFor="confirm" className="text-sm text-gray-700 dark:text-gray-300">
                        I confirm that all details provided are true and genuine.
                      </label>
                    </div>

                    <div className="pt-2">
                      <Button
                        type="submit"
                        variant="default"
                        size="xl"
                        className={`w-full justify-center rounded-full bg-blue-600 text-white shadow-[0_10px_24px_-6px_rgba(37,99,235,0.55)] ring-1 ring-blue-300/50 transition-transform hover:bg-blue-700 hover:shadow-[0_14px_32px_-6px_rgba(37,99,235,0.6)] hover:scale-[1.01] active:scale-[0.99] ${
                          canSubmit ? 'animate-pulse' : ''
                        }`}
                        disabled={!canSubmit}
                        leftIcon={<ClipboardDocumentCheckIcon className="h-5 w-5" />}
                        aria-label={submitting ? 'Submitting report' : submitted ? 'Report submitted' : 'Submit report'}
                        title={submitting ? 'Submitting report' : submitted ? 'Report submitted' : 'Submit report'}
                      >
                        {submitting ? 'Submitting…' : submitted ? 'Submitted ✅' : 'Submit Report'}
                      </Button>
                      {!canSubmit && (
                        <p className="mt-2 text-xs text-amber-600">
                          {missingHints.join(' • ')}
                        </p>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right: Quick Guide + Live Preview */}
          <div className="lg:col-span-6 space-y-6">
            {/* Quick Guide */}
            <div className="rounded-2xl p-[1px] bg-gradient-to-br from-fuchsia-400/50 via-purple-400/40 to-pink-400/50">
              <Card className="rounded-2xl p-0 bg-white/70 dark:bg-gray-900/60 backdrop-blur ring-1 ring-gray-200/60 dark:ring-white/10">
                <CardHeader className="px-6 pt-6">
                  <CardTitle className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-500 ring-1 ring-white/20 shadow-md">
                      <ClipboardDocumentCheckIcon className="h-4 w-4 text-white" />
                    </span>
                    <span>Quick Guide</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-2">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Follow these steps to submit an effective report that gets results.
                  </p>
                  <div className="space-y-3">
                    <div className="rounded-xl p-4 ring-1 ring-gray-200/60 dark:ring-white/10 bg-white/70 dark:bg-gray-900/50">
                      <div className="font-medium text-gray-900 dark:text-white">1. Capture Evidence</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Upload clear photos or short videos. Include close-up and wide shots.</div>
                    </div>
                    <div className="rounded-xl p-4 ring-1 ring-gray-200/60 dark:ring-white/10 bg-white/70 dark:bg-gray-900/50">
                      <div className="font-medium text-gray-900 dark:text-white">2. Describe & Categorize</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Pick the right category and write a concise, factual description.</div>
                    </div>
                    <div className="rounded-xl p-4 ring-1 ring-gray-200/60 dark:ring-white/10 bg-white/70 dark:bg-gray-900/50">
                      <div className="font-medium text-gray-900 dark:text-white">3. Pin Accurate Location</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Use current location or add a landmark so teams can find it quickly.</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Live Preview */}
            <div className="rounded-2xl p-[1px] bg-gradient-to-br from-emerald-400/50 via-blue-400/40 to-cyan-400/50">
              <Card className="rounded-2xl p-0 bg-white/70 dark:bg-gray-900/60 backdrop-blur ring-1 ring-gray-200/60 dark:ring-white/10">
                <CardHeader className="px-6 pt-6">
                  <CardTitle className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 ring-1 ring-white/20 shadow-md">
                      <CheckCircleIcon className="h-4 w-4 text-white" />
                    </span>
                    <span>Report Preview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-2">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600 dark:text-gray-300">Category</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{category === 'Other' && customCategory ? customCategory : category}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600 dark:text-gray-300">Severity</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{severity}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600 dark:text-gray-300">Location</div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{address || '—'}</div>
                        {(coords.lat && coords.lng) && (
                          <div className="text-xs text-gray-600 dark:text-gray-400">{coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}</div>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Title</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{title || '—'}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Description</div>
                      <div className="text-sm text-gray-900 dark:text-gray-200 whitespace-pre-wrap">{description || '—'}</div>
                    </div>
                    {media.length > 0 && (
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">Attachments</div>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                          {media.map((m) => (
                            <div key={m.url} className="relative rounded-lg overflow-hidden ring-1 ring-gray-200/60 dark:ring-white/10">
                              {m.kind === 'image' ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={m.url} alt="attachment" className="h-24 w-full object-cover" />
                              ) : (
                                <video src={m.url} className="h-24 w-full object-cover" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      {/* Success popup */}
      {submitted && createdId && (
        <SuccessPopup
          onView={() => router.push(`/issue/${createdId}`)}
          onClose={() => router.push('/dashboard')}
        />)
      }
    </>
  )
}

// --- helpers ---
function normalizeCategory(input: string, custom?: string): IssueCategory {
  const key = input.toLowerCase()
  if (key.includes('pothole') || key.includes('road')) return 'pothole'
  if (key.includes('street') || key.includes('light')) return 'streetlight'
  if (key.includes('garbage') || key.includes('waste')) return 'garbage'
  if (key.includes('water')) return 'water'
  if (key.includes('graffiti')) return 'graffiti'
  if (key.includes('road')) return 'road'
  if (input === 'Other' && custom) {
    const c = custom.toLowerCase()
    if (c.includes('pothole') || c.includes('road')) return 'pothole'
    if (c.includes('street') || c.includes('light')) return 'streetlight'
    if (c.includes('garbage') || c.includes('waste')) return 'garbage'
    if (c.includes('water')) return 'water'
    if (c.includes('graffiti')) return 'graffiti'
  }
  return 'other'
}

function genReportId(): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const len = 12
  try {
    const bytes = new Uint32Array(len)
    globalThis.crypto?.getRandomValues?.(bytes)
    return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('')
  } catch {
    return Array.from({ length: len }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('')
  }
}

function SuccessPopup({ onView, onClose }: { onView: () => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl ring-1 ring-slate-200">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
          <svg className="h-6 w-6 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-900">Report submitted</h3>
        <p className="mt-1 text-sm text-slate-600">Thank you for improving your city. Admins can now review your report.</p>
        <div className="mt-5 flex gap-3">
          <Button className="flex-1" onClick={onView}>View report</Button>
          <Button variant="outline" className="flex-1" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  )
}
