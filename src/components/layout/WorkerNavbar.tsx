'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useAuthStore } from '@/store'

export default function WorkerNavbar() {
  const pathname = usePathname()
  const { logout } = useAuthStore()

  const nav = [
    { name: 'Dashboard', href: '/worker/dashboard' },
    { name: 'Assigned', href: '/worker/assigned' },
    { name: 'In Progress', href: '/worker/in-progress' },
    { name: 'Completed', href: '/worker/completed' },
  ]

  return (
    <nav className="relative w-full bg-white border-b border-gray-200 shadow dark:bg-gray-900 dark:border-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/worker/dashboard" className="flex items-center gap-2 navbar-brand" aria-label="Worker dashboard home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/logo.png" alt="CitiZen" className="h-10 w-10 object-contain drop-shadow-md" />
            <div className="leading-tight">
              <div className="font-heading text-xl font-bold -mb-0.5 tracking-tight text-black dark:text-white">Worker</div>
              <div className="text-[10px] tracking-wide text-gray-600 dark:text-gray-300">Tasks & Assignments</div>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`text-sm font-medium rounded-full px-3 py-1.5 transition ring-1 ring-transparent ${
                  pathname === n.href
                    ? 'bg-gray-100 text-black'
                    : 'text-black/90 hover:text-black bg-white/0 hover:bg-gray-50 hover:ring-gray-100'
                } navbar-link`}
              >
                {n.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button onClick={logout} className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-black bg-white/0 hover:bg-gray-50 ring-1 ring-gray-200 transition navbar-btn dark:text-white dark:ring-white/15">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
