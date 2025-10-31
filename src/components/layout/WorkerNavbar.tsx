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
    <nav className="relative w-full text-white backdrop-blur shadow bg-gradient-to-r from-emerald-600/80 via-teal-600/70 to-blue-600/80 border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/worker/dashboard" className="flex items-center gap-2" aria-label="Worker dashboard home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/logo.png" alt="CitiZen" className="h-10 w-10 object-contain drop-shadow-md" />
            <div className="leading-tight">
              <div className="font-heading text-xl font-bold -mb-0.5 tracking-tight">Worker</div>
              <div className="text-[10px] tracking-wide text-blue-50/90">Tasks & Assignments</div>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`text-sm font-medium rounded-full px-3 py-1.5 transition ring-1 ring-transparent ${
                  pathname === n.href
                    ? 'bg-white/15 text-white'
                    : 'text-white/90 hover:text-white bg-white/0 hover:bg-white/10 hover:ring-white/10'
                }`}
              >
                {n.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button onClick={logout} className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-white bg-white/10 hover:bg-white/15 ring-1 ring-white/15 hover:ring-white/25 transition">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
