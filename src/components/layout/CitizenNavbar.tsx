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
      className="relative w-full bg-white border-b border-gray-200 shadow dark:bg-gray-900 dark:border-gray-800"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Brand */}
          <Link href="/dashboard" className="flex items-center gap-2 navbar-brand" aria-label="CitiZen home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/logo.png"
              alt="CitiZen"
              className="h-10 w-10 md:h-12 md:w-12 object-contain drop-shadow-md"
            />
            <div className="leading-tight">
              <div className="font-heading text-xl md:text-2xl font-bold -mb-0.5 tracking-tight text-black dark:text-white">CitiZen</div>
              <div className="text-[10px] md:text-xs tracking-wide text-gray-600 dark:text-gray-300">Your voice, Your City, Your Impact</div>
            </div>
          </Link>

          {/* Nav Items */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-black/90 hover:text-black rounded-full px-3 py-1.5 bg-white/0 hover:bg-gray-50 ring-1 ring-transparent hover:ring-gray-100 transition navbar-link"
            >
              Home
            </Link>
            <Link
              href="/report"
              className="text-sm font-medium text-black/90 hover:text-black rounded-full px-3 py-1.5 bg-white/0 hover:bg-gray-50 ring-1 ring-transparent hover:ring-gray-100 transition navbar-link"
            >
              Report
            </Link>
            <Link
              href="/community"
              className="text-sm font-medium text-black/90 hover:text-black rounded-full px-3 py-1.5 bg-white/0 hover:bg-gray-50 ring-1 ring-transparent hover:ring-gray-100 transition navbar-link"
            >
              Community Issues
            </Link>
            <Link
              href="/profile"
              className="text-sm font-medium text-black/90 hover:text-black rounded-full px-3 py-1.5 bg-white/0 hover:bg-gray-50 ring-1 ring-transparent hover:ring-gray-100 transition navbar-link"
            >
              Profile
            </Link>
            <Link
              href="/help"
              className="text-sm font-medium text-black/90 hover:text-black rounded-full px-3 py-1.5 bg-white/0 hover:bg-gray-50 ring-1 ring-transparent hover:ring-gray-100 transition navbar-link"
            >
              Help
            </Link>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-black bg-white/0 hover:bg-gray-50 ring-1 ring-gray-200 transition navbar-btn dark:text-white dark:ring-white/15"
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
