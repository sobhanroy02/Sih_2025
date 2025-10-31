'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import CitizenNavbar from '@/components/layout/CitizenNavbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAuthStore, useIssuesStore } from '@/store'
import { 
  ChatBubbleLeftIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  MapPinIcon,
  PlusIcon,
  ArrowRightIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline'

export default function Dashboard() {
  const { user } = useAuthStore()
  const { issues } = useIssuesStore()
  
  // Mock data for demonstration
  const userIssues = issues.filter(issue => issue.reportedBy === user?.id)
  const recentActivity = [
    { id: 1, action: 'Issue updated', description: 'Your pothole report on Main Street is now in progress', time: '2 hours ago', type: 'update' },
    { id: 2, action: 'Issue resolved', description: 'Street light repair on Oak Avenue has been completed', time: '1 day ago', type: 'resolved' },
    { id: 3, action: 'New comment', description: 'Municipal admin commented on your garbage collection issue', time: '3 days ago', type: 'comment' },
  ]

  const stats = [
    {
      name: 'Issues Reported',
      value: userIssues.length,
      change: '+2',
      changeType: 'increase',
      icon: ChatBubbleLeftIcon,
    },
    {
      name: 'Issues Resolved',
      value: userIssues.filter(issue => issue.status === 'resolved').length,
      change: '+1',
      changeType: 'increase',
      icon: CheckCircleIcon,
    },
    {
      name: 'Community Impact',
      value: '847',
      change: '+15',
      changeType: 'increase',
      icon: UserGroupIcon,
    },
    {
      name: 'Current Streak',
      value: '12 days',
      change: 'Active',
      changeType: 'neutral',
      icon: CalendarDaysIcon,
    },
  ]

  const quickActions = [
    {
      name: 'Report an Issue',
      description: 'Report a municipal issue in your area',
      href: '/report',
      icon: PlusIcon,
      // Gradient background for icon
      iconBg: 'bg-gradient-to-br from-rose-500 to-orange-500',
      // Gradient border for card wrapper
      border: 'from-rose-400/50 via-orange-400/40 to-amber-400/50',
    },
    {
      name: 'View Community Issues',
      description: 'See what others are reporting nearby',
      href: '/community',
      icon: UserGroupIcon,
      iconBg: 'bg-gradient-to-br from-sky-500 to-indigo-500',
      border: 'from-sky-400/50 via-indigo-400/40 to-violet-400/50',
    },
    {
      name: 'Track My Reports',
      description: 'Check the status of your submissions',
      href: '/profile',
      icon: ClockIcon,
      iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-500',
      border: 'from-emerald-400/50 via-teal-400/40 to-cyan-400/50',
    },
  ]

  // Gradients for "Your Impact" cards (border + icon background)
  const statGradients = [
    { border: 'from-emerald-400/50 via-blue-400/40 to-cyan-400/50', iconBg: 'from-emerald-500 to-teal-500' },
    { border: 'from-amber-400/50 via-rose-400/40 to-orange-400/50', iconBg: 'from-amber-500 to-rose-500' },
    { border: 'from-sky-400/50 via-indigo-400/40 to-violet-400/50', iconBg: 'from-sky-500 to-indigo-500' },
    { border: 'from-fuchsia-400/50 via-purple-400/40 to-pink-400/50', iconBg: 'from-fuchsia-500 to-pink-500' },
  ]

  return (
    <>
      <CitizenNavbar />
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 text-default">
        {/* Hero row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left content */}
          <section className="lg:col-span-7">
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 dark:text-white">
              {`Hi ${user?.name?.split(' ')[0] || 'Citizen'}`}
            </h1>
            <p className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
              Let&apos;s improve your city today.
            </p>
            <p className="mt-4 max-w-2xl text-slate-600 dark:text-slate-300">
              Report issues, track resolutions and collaborate. Everything you need to make local impact is here.
            </p>

            {/* KPI cards */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl">
              <div className="rounded-xl p-4 shadow-sm ring-1 ring-white/30
                              bg-gradient-to-br from-emerald-500/10 via-blue-500/10 to-cyan-500/10 backdrop-blur">
                <div className="text-xs uppercase tracking-wide text-slate-500">Active Issues</div>
                <div className="mt-1 text-2xl font-bold text-slate-900">1,247</div>
              </div>
              <div className="rounded-xl p-4 shadow-sm ring-1 ring-white/30
                              bg-gradient-to-br from-emerald-600/10 via-emerald-500/10 to-teal-500/10 backdrop-blur">
                <div className="text-xs uppercase tracking-wide text-slate-500">Resolved</div>
                <div className="mt-1 text-2xl font-bold text-emerald-600">87%</div>
              </div>
              <div className="rounded-xl p-4 shadow-sm ring-1 ring-white/30
                              bg-gradient-to-br from-indigo-500/10 via-violet-500/10 to-fuchsia-500/10 backdrop-blur">
                <div className="text-xs uppercase tracking-wide text-slate-500">Avg Resolve Time</div>
                <div className="mt-1 text-2xl font-bold text-slate-900">3d</div>
              </div>
              <div className="rounded-xl p-4 shadow-sm ring-1 ring-white/30
                              bg-gradient-to-br from-sky-500/10 via-cyan-500/10 to-emerald-500/10 backdrop-blur">
                <div className="text-xs uppercase tracking-wide text-slate-500">Communities</div>
                <div className="mt-1 text-2xl font-bold text-slate-900">56</div>
              </div>
            </div>

            {/* How it works */}
            <div className="mt-10">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">How CitiZen works</h2>
              <ol className="mt-3 space-y-3 text-slate-700 dark:text-slate-300 list-decimal pl-5">
                <li>Report an issue with photos, location and details. Our system routes it to the right department.</li>
                <li>Track progress in real-time. Get updates from admins and field workers.</li>
                <li>Collaborate through comments and votes. Prioritize what matters most to your community.</li>
                <li>See resolutions and outcomes. Celebrate cleaner, safer, better neighborhoods.</li>
              </ol>
            </div>
          </section>

          {/* Right image */}
          <aside className="lg:col-span-5">
            <div className="relative h-56 sm:h-72 lg:h-[22rem] rounded-2xl overflow-hidden ring-1 ring-blue-200/60 shadow-sm bg-slate-100">
              <Image
                src="/home-page-1.1.jpg"
                alt="Citizens collaborating to improve their city"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-bottom"
                priority
              />
            </div>
          </aside>
        </div>

  {/* Quick Actions (keep existing dashboard content below) */}
    <div className="mt-12 md:mt-16">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {quickActions.map((action) => (
              <Link key={action.name} href={action.href} aria-label={action.name} className="block group">
                <div className={`rounded-2xl p-[1px] bg-gradient-to-br ${action.border} transition-all duration-300 group-hover:shadow-xl` }>
                  <div className="rounded-2xl bg-white/70 dark:bg-gray-900/60 backdrop-blur ring-1 ring-gray-200/60 dark:ring-white/10 p-6 min-h-[112px] flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${action.iconBg} shadow-md ring-1 ring-white/20 transform transition-transform duration-300 group-hover:scale-110` }>
                        {action.name === 'Report an Issue' ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src="/icons/report-new.svg" alt="Report" className="h-6 w-6" />
                        ) : (
                          <action.icon className="h-6 w-6 text-white drop-shadow" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white tracking-tight">
                          {action.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {action.description}
                        </p>
                      </div>
                    </div>
                    <ArrowRightIcon className="h-5 w-5 text-slate-500 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-slate-700 dark:group-hover:text-slate-200" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-12">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Impact</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, idx) => (
              <div key={stat.name} className={`rounded-2xl p-[1px] bg-gradient-to-br ${statGradients[idx % statGradients.length].border} transition-all duration-300 hover:shadow-xl` }>
                <Card className="rounded-2xl bg-white/70 dark:bg-gray-900/60 backdrop-blur ring-1 ring-gray-200/60 dark:ring-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center animate-[fade-in-up_0.5s_ease-out]">
                      <div className="flex-shrink-0">
                        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${statGradients[idx % statGradients.length].iconBg} ring-1 ring-white/20 shadow-md transition-transform duration-300` }>
                          <stat.icon className="h-6 w-6 text-white drop-shadow" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          {stat.name}
                        </div>
                        <div className="text-2xl font-extrabold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                          {stat.value}
                        </div>
                        <div className={`text-sm ${
                          stat.changeType === 'increase' 
                            ? 'text-green-600' 
                            : stat.changeType === 'decrease' 
                            ? 'text-red-600' 
                            : 'text-gray-500'
                        }`}>
                          {stat.change}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 mt-12 items-stretch">
          {/* Recent Activity */}
          <div className="rounded-2xl h-full">
            <Card className="rounded-2xl p-0 h-full flex flex-col bg-fuchsia-50/70 dark:bg-fuchsia-950/20 backdrop-blur ring-1 ring-fuchsia-200/60 dark:ring-fuchsia-700/50">
              <CardHeader className="px-6 pt-6">
                <CardTitle className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-500 ring-1 ring-white/20 shadow-md">
                    <ClockIcon className="h-4 w-4 text-white" />
                  </span>
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="space-y-4">
                  {recentActivity.map((activity, i) => (
                    <div key={activity.id} className="flex gap-3 items-start animate-[fade-in-up_0.5s_ease-out]" style={{ animationDelay: `${i * 60}ms` }}>
                      <div className={`mt-1 h-2 w-2 rounded-full ${
                        activity.type === 'resolved' ? 'bg-green-500' : activity.type === 'update' ? 'bg-pink-500' : 'bg-yellow-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.action}
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-auto pt-4">
                  <Button variant="outline" className="w-full border-fuchsia-300 text-fuchsia-700 hover:bg-fuchsia-100 dark:border-fuchsia-700 dark:text-fuchsia-300 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md" size="sm">
                    View All Activity
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Nearby Issues Map Preview */}
          <div className="rounded-2xl p-[1px] h-full bg-gradient-to-br from-fuchsia-400/50 via-purple-400/40 to-pink-400/50">
            <Card className="rounded-2xl p-0 h-full flex flex-col bg-white/70 dark:bg-gray-900/60 backdrop-blur ring-1 ring-gray-200/60 dark:ring-white/10">
              <CardHeader className="px-6 pt-6">
                <CardTitle className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-500 ring-1 ring-white/20 shadow-md">
                    <MapPinIcon className="h-4 w-4 text-white" />
                  </span>
                  <span>Nearby Issues</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="rounded-xl p-[1px] bg-gradient-to-br from-fuchsia-300/40 via-purple-300/30 to-pink-300/40 mb-4">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-[0.65rem] h-48 flex items-center justify-center">
                    <div className="text-center">
                      <MapPinIcon className="h-12 w-12 text-gray-400 mx-auto mb-2 animate-pulse-gentle" />
                      <p className="text-gray-500 dark:text-gray-400">Interactive map will load here</p>
                      <p className="text-sm text-gray-400">Showing issues within 2km radius</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Open issues nearby</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Resolved this week</span>
                    <span className="text-sm font-medium text-green-600">8</span>
                  </div>
                </div>
                <div className="mt-auto pt-4">
                  <Link href="/community">
                    <Button variant="outline" className="w-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md" size="sm">
                      View All Community Issues
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

  {/* Achievement Banner */}
  <Card className="mt-12 md:mt-16 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-yellow-500/10
                         dark:from-amber-900/20 dark:via-orange-900/20 dark:to-yellow-900/20
                         backdrop-blur ring-1 ring-amber-200/60 dark:ring-amber-700/40">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-amber-100/80 dark:bg-amber-800/60 rounded-full flex items-center justify-center ring-1 ring-white/30">
                  <CheckCircleIcon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-amber-900 dark:text-amber-100">
                  Achievement Unlocked: Community Guardian
                </h3>
                <p className="text-amber-700 dark:text-amber-300">
                  You&apos;ve successfully reported and helped resolve 5 community issues. Keep making a difference!
                </p>
              </div>
              <div className="flex-shrink-0">
                <Link href="/profile">
                  <Button variant="outline" size="sm" className="border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-600 dark:text-amber-300">
                    View Achievements
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}