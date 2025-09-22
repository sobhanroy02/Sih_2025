'use client'

import React from 'react'
import Link from 'next/link'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
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
  ArrowTrendingUpIcon,
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
      name: 'Report New Issue',
      description: 'Report a municipal issue in your area',
      href: '/report',
      icon: PlusIcon,
      color: 'bg-primary-500',
    },
    {
      name: 'View Community Issues',
      description: 'See what others are reporting nearby',
      href: '/community',
      icon: UserGroupIcon,
      color: 'bg-teal-500',
    },
    {
      name: 'Track My Reports',
      description: 'Check the status of your submissions',
      href: '/profile',
      icon: ClockIcon,
      color: 'bg-emerald-500',
    },
  ]

  return (
    <DashboardLayout userType="citizen">
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-600 to-teal-600 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold font-heading mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-primary-100 mb-4">
            You&apos;re making a difference in {user?.municipality}. Keep up the great work!
          </p>
          <div className="flex items-center space-x-4 text-primary-100">
            <div className="flex items-center space-x-2">
              <MapPinIcon className="h-4 w-4" />
              <span className="text-sm">{user?.city}, Ward {user?.ward}</span>
            </div>
            <div className="flex items-center space-x-2">
              <ArrowTrendingUpIcon className="h-4 w-4" />
              <span className="text-sm">Community Champion</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {quickActions.map((action) => (
              <Link key={action.name} href={action.href}>
                <Card className="hover:shadow-medium transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${action.color}`}>
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {action.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Impact</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.name}>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <stat.icon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {stat.name}
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
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
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ClockIcon className="h-5 w-5" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex space-x-3">
                    <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'resolved' 
                        ? 'bg-green-500' 
                        : activity.type === 'update' 
                        ? 'bg-blue-500' 
                        : 'bg-yellow-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.action}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button variant="outline" className="w-full" size="sm">
                  View All Activity
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Nearby Issues Map Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPinIcon className="h-5 w-5" />
                <span>Nearby Issues</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg h-48 flex items-center justify-center mb-4">
                <div className="text-center">
                  <MapPinIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">Interactive map will load here</p>
                  <p className="text-sm text-gray-400">Showing issues within 2km radius</p>
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
              <div className="mt-4">
                <Link href="/community">
                  <Button variant="outline" className="w-full" size="sm">
                    View All Community Issues
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievement Banner */}
        <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-800">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-800 rounded-full flex items-center justify-center">
                  <CheckCircleIcon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-emerald-900 dark:text-emerald-100">
                  Achievement Unlocked: Community Guardian
                </h3>
                <p className="text-emerald-700 dark:text-emerald-300">
                  You&apos;ve successfully reported and helped resolve 5 community issues. Keep making a difference!
                </p>
              </div>
              <div className="flex-shrink-0">
                <Link href="/profile">
                  <Button variant="outline" size="sm" className="border-emerald-300 text-emerald-700 hover:bg-emerald-100">
                    View Achievements
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}