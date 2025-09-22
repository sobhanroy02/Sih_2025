'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuthStore, useIssuesStore } from '@/store'
import { 
  UserIcon,
  PencilIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  TrophyIcon,
  CalendarDaysIcon,
  MapPinIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

interface ProfileFormData {
  name: string
  email: string
  phone: string
  city: string
  ward: string
  municipality: string
}

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore()
  const { issues } = useIssuesStore()
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ProfileFormData>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      city: user?.city || '',
      ward: user?.ward || '',
      municipality: user?.municipality || '',
    }
  })

  // Calculate user statistics
  const userIssues = issues.filter(issue => issue.reportedBy === user?.id)
  const resolvedIssues = userIssues.filter(issue => issue.status === 'resolved')
  const totalUpvotes = userIssues.reduce((sum, issue) => sum + issue.upvotes, 0)

  const achievements = [
    {
      id: 'first-report',
      title: 'First Reporter',
      description: 'Reported your first issue',
      icon: '🎯',
      achieved: userIssues.length > 0,
    },
    {
      id: 'active-citizen',
      title: 'Active Citizen',
      description: 'Reported 5+ issues',
      icon: '🏆',
      achieved: userIssues.length >= 5,
    },
    {
      id: 'community-helper',
      title: 'Community Helper',
      description: 'Received 10+ upvotes',
      icon: '🤝',
      achieved: totalUpvotes >= 10,
    },
    {
      id: 'problem-solver',
      title: 'Problem Solver',
      description: 'Had 3+ issues resolved',
      icon: '✅',
      achieved: resolvedIssues.length >= 3,
    },
  ]

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      updateUser({
        ...user!,
        ...data,
      })
      
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    reset()
    setIsEditing(false)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date))
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      'open': 'bg-red-100 text-red-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      'resolved': 'bg-green-100 text-green-800',
      'closed': 'bg-gray-100 text-gray-800',
    }
    return colors[status as keyof typeof colors] || colors.open
  }

  if (!user) {
    return (
      <DashboardLayout userType="citizen">
        <div className="text-center">
          <p>Please log in to view your profile.</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userType="citizen">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-heading">
            My Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your account information and view your activity
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <UserIcon className="h-5 w-5" />
                    <span>Personal Information</span>
                  </CardTitle>
                  {!isEditing && (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <PencilIcon className="h-4 w-4" />
                      <span>Edit</span>
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      {...register('name', { required: 'Name is required' })}
                      error={errors.name?.message}
                      disabled={!isEditing}
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      {...register('email', { required: 'Email is required' })}
                      error={errors.email?.message}
                      disabled={!isEditing}
                    />
                    <Input
                      label="Phone Number"
                      {...register('phone')}
                      error={errors.phone?.message}
                      disabled={!isEditing}
                      placeholder="+1 (555) 123-4567"
                    />
                    <Input
                      label="City"
                      {...register('city', { required: 'City is required' })}
                      error={errors.city?.message}
                      disabled={!isEditing}
                    />
                    <Input
                      label="Ward/District"
                      {...register('ward')}
                      error={errors.ward?.message}
                      disabled={!isEditing}
                    />
                    <Input
                      label="Municipality"
                      {...register('municipality')}
                      error={errors.municipality?.message}
                      disabled={!isEditing}
                    />
                  </div>

                  {isEditing && (
                    <div className="flex space-x-4">
                      <Button
                        type="submit"
                        loading={isSubmitting}
                        variant="gradient"
                        className="flex-1"
                      >
                        Save Changes
                      </Button>
                      <Button
                        type="button"
                        onClick={handleCancel}
                        variant="outline"
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ClockIcon className="h-5 w-5" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userIssues.length === 0 ? (
                  <div className="text-center py-8">
                    <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No Issues Reported Yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Start contributing to your community by reporting issues.
                    </p>
                    <Button
                      onClick={() => window.location.href = '/report'}
                      variant="gradient"
                    >
                      Report Your First Issue
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userIssues.slice(0, 5).map((issue) => (
                      <div
                        key={issue.id}
                        className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {issue.title}
                          </h4>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <MapPinIcon className="h-4 w-4" />
                              <span>{issue.location.address}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <CalendarDaysIcon className="h-4 w-4" />
                              <span>{formatDate(issue.reportedAt)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getStatusBadge(issue.status)}`}>
                            {issue.status.charAt(0).toUpperCase() + issue.status.slice(1).replace('-', ' ')}
                          </span>
                          <span className="text-sm text-gray-500">
                            {issue.upvotes} upvotes
                          </span>
                        </div>
                      </div>
                    ))}
                    {userIssues.length > 5 && (
                      <div className="text-center">
                        <Button variant="outline" size="sm">
                          View All Issues ({userIssues.length})
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Your Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">
                      {userIssues.length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Issues Reported
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {resolvedIssues.length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Issues Resolved
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {totalUpvotes}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Total Upvotes
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrophyIcon className="h-5 w-5" />
                  <span>Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`flex items-start space-x-3 p-3 rounded-lg ${
                        achievement.achieved
                          ? 'bg-green-50 dark:bg-green-900/20 border border-green-200'
                          : 'bg-gray-50 dark:bg-gray-800 opacity-60'
                      }`}
                    >
                      <div className="text-lg">
                        {achievement.achieved ? achievement.icon : '🔒'}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-medium ${
                          achievement.achieved
                            ? 'text-green-800 dark:text-green-200'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {achievement.title}
                        </h4>
                        <p className={`text-sm ${
                          achievement.achieved
                            ? 'text-green-600 dark:text-green-300'
                            : 'text-gray-500 dark:text-gray-500'
                        }`}>
                          {achievement.description}
                        </p>
                      </div>
                      {achievement.achieved && (
                        <CheckCircleIcon className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Account Status */}
            <Card>
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Email Verified
                    </span>
                    <div className="flex items-center space-x-2">
                      <CheckCircleIcon className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600">Verified</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Account Type
                    </span>
                    <span className="text-sm font-medium capitalize">
                      {user.role}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Member Since
                    </span>
                    <span className="text-sm">
                      January 2024
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}