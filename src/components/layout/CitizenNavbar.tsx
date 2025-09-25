'use client'

import React from 'react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useAuthStore } from '@/store'
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'

export function CitizenNavbar() {
  const { logout } = useAuthStore()

  return (
    <nav
      aria-label="Citizen primary navigation"
      className="relative w-full text-white backdrop-blur shadow
                 bg-gradient-to-r from-blue-600/80 via-blue-600/70 to-blue-700/80
                 supports-[backdrop-filter]:from-blue-600/70 supports-[backdrop-filter]:to-blue-700/70
                 border-b border-white/10"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Brand */}
          <Link href="/dashboard" className="flex items-center gap-2" aria-label="CitiZen home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/logo.png"
              alt="CitiZen"
              className="h-10 w-10 md:h-12 md:w-12 object-contain drop-shadow-md"
            />
            <div className="leading-tight">
              <div className="font-heading text-xl md:text-2xl font-bold -mb-0.5 tracking-tight">CitiZen</div>
              <div className="text-[10px] md:text-xs tracking-wide text-blue-50/90">Your voice, Your City, Your Impact</div>
            </div>
          </Link>

          {/* Nav Items */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-white/90 hover:text-white rounded-full px-3 py-1.5
                         bg-white/0 hover:bg-white/10 ring-1 ring-transparent hover:ring-white/10 transition"
            >
              Home
            </Link>
            <Link
              href="/report"
              className="text-sm font-medium text-white/90 hover:text-white rounded-full px-3 py-1.5
                         bg-white/0 hover:bg-white/10 ring-1 ring-transparent hover:ring-white/10 transition"
            >
              Report
            </Link>
            <Link
              href="/community"
              className="text-sm font-medium text-white/90 hover:text-white rounded-full px-3 py-1.5
                         bg-white/0 hover:bg-white/10 ring-1 ring-transparent hover:ring-white/10 transition"
            >
              Community Issues
            </Link>
            <Link
              href="/profile"
              className="text-sm font-medium text-white/90 hover:text-white rounded-full px-3 py-1.5
                         bg-white/0 hover:bg-white/10 ring-1 ring-transparent hover:ring-white/10 transition"
            >
              Profile
            </Link>
            <Link
              href="/help"
              className="text-sm font-medium text-white/90 hover:text-white rounded-full px-3 py-1.5
                         bg-white/0 hover:bg-white/10 ring-1 ring-transparent hover:ring-white/10 transition"
            >
              Help
            </Link>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-white
                         bg-white/10 hover:bg-white/15 ring-1 ring-white/15 hover:ring-white/25 transition"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default CitizenNavbar
