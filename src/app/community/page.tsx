'use client'

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useIssuesStore } from '@/store'
import { 
  MagnifyingGlassIcon,
  ChevronUpIcon,
  ChatBubbleLeftIcon,
  MapPinIcon,
  CalendarDaysIcon,
  UserIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { ChevronUpIcon as ChevronUpSolid } from '@heroicons/react/24/solid'

type SortOption = 'newest' | 'oldest' | 'most-upvoted' | 'least-upvoted'
type FilterOption = 'all' | 'open' | 'in-progress' | 'resolved' | 'closed'

export default function CommunityIssuesPage() {
  const { issues } = useIssuesStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [filterBy, setFilterBy] = useState<FilterOption>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [upvotedIssues, setUpvotedIssues] = useState<Set<string>>(new Set())

  const categories = [
    { id: 'all', name: 'All Categories', icon: '📋' },
    { id: 'pothole', name: 'Pothole', icon: '🚧' },
    { id: 'streetlight', name: 'Street Light', icon: '💡' },
    { id: 'garbage', name: 'Garbage/Waste', icon: '🗑️' },
    { id: 'water', name: 'Water Issue', icon: '💧' },
    { id: 'graffiti', name: 'Graffiti', icon: '🎨' },
    { id: 'road', name: 'Road Damage', icon: '🛣️' },
    { id: 'other', name: 'Other', icon: '📝' },
  ]

  const statusColors = {
    'open': 'bg-red-100 text-red-800 border-red-200',
    'in-progress': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'resolved': 'bg-green-100 text-green-800 border-green-200',
    'closed': 'bg-gray-100 text-gray-800 border-gray-200',
  }

  const priorityColors = {
    'low': 'bg-green-100 text-green-800',
    'medium': 'bg-yellow-100 text-yellow-800',
    'high': 'bg-orange-100 text-orange-800',
    'critical': 'bg-red-100 text-red-800',
  }

  const filteredAndSortedIssues = issues
    .filter(issue => {
      const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           issue.location.address.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = filterBy === 'all' || issue.status === filterBy
      const matchesCategory = selectedCategory === 'all' || issue.category === selectedCategory
      
      return matchesSearch && matchesStatus && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime()
        case 'oldest':
          return new Date(a.reportedAt).getTime() - new Date(b.reportedAt).getTime()
        case 'most-upvoted':
          return b.upvotes - a.upvotes
        case 'least-upvoted':
          return a.upvotes - b.upvotes
        default:
          return 0
      }
    })

  const handleUpvote = (issueId: string) => {
    if (upvotedIssues.has(issueId)) {
      // Remove upvote
      setUpvotedIssues(prev => {
        const newSet = new Set(prev)
        newSet.delete(issueId)
        return newSet
      })
      // In real app, call API to remove upvote
    } else {
      // Add upvote
      setUpvotedIssues(prev => new Set([...prev, issueId]))
      // In real app, call API to add upvote
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date))
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 30) return `${diffInDays}d ago`
    
    const diffInMonths = Math.floor(diffInDays / 30)
    return `${diffInMonths}mo ago`
  }

  return (
    <DashboardLayout userType="citizen">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-heading">
              Community Issues
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Browse and support issues reported by your community
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button
              onClick={() => window.location.href = '/report'}
              variant="gradient"
              className="w-full sm:w-auto"
            >
              Report New Issue
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search issues by title, description, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters Row */}
              <div className="flex flex-wrap gap-4">
                {/* Status Filter */}
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value as FilterOption)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
                  >
                    <option value="all">All Status</option>
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                {/* Sort Filter */}
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="most-upvoted">Most Upvoted</option>
                    <option value="least-upvoted">Least Upvoted</option>
                  </select>
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-primary-100 text-primary-800 border border-primary-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredAndSortedIssues.length} issue{filteredAndSortedIssues.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Issues List */}
        <div className="space-y-4">
          {filteredAndSortedIssues.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No issues found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Try adjusting your search criteria or filters.
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm('')
                    setFilterBy('all')
                    setSelectedCategory('all')
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredAndSortedIssues.map((issue) => (
              <Card key={issue.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                    {/* Main Content */}
                    <div className="flex-1 lg:pr-6">
                      {/* Title and Category */}
                      <div className="flex flex-wrap items-start gap-2 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {issue.title}
                        </h3>
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                          {categories.find(c => c.id === issue.category)?.icon} {categories.find(c => c.id === issue.category)?.name}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {issue.description}
                      </p>

                      {/* Location and Meta Info */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center space-x-1">
                          <MapPinIcon className="h-4 w-4" />
                          <span>{issue.location.address}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CalendarDaysIcon className="h-4 w-4" />
                          <span>{formatDate(issue.reportedAt)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <UserIcon className="h-4 w-4" />
                          <span>Reported by citizen</span>
                        </div>
                      </div>

                      {/* Status and Priority Badges */}
                      <div className="flex flex-wrap gap-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${statusColors[issue.status]}`}>
                          {issue.status.charAt(0).toUpperCase() + issue.status.slice(1).replace('-', ' ')}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${priorityColors[issue.priority]}`}>
                          {issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)} Priority
                        </span>
                      </div>
                    </div>

                    {/* Actions Sidebar */}
                    <div className="flex lg:flex-col items-center lg:items-end space-x-4 lg:space-x-0 lg:space-y-4">
                      {/* Upvote Button */}
                      <button
                        onClick={() => handleUpvote(issue.id)}
                        className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                          upvotedIssues.has(issue.id)
                            ? 'bg-primary-100 text-primary-600'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {upvotedIssues.has(issue.id) ? (
                          <ChevronUpSolid className="h-5 w-5" />
                        ) : (
                          <ChevronUpIcon className="h-5 w-5" />
                        )}
                        <span className="text-sm font-medium">
                          {issue.upvotes + (upvotedIssues.has(issue.id) ? 1 : 0)}
                        </span>
                      </button>

                      {/* Comments */}
                      <div className="flex flex-col items-center p-2 text-gray-600">
                        <ChatBubbleLeftIcon className="h-5 w-5" />
                        <span className="text-sm">{issue.comments.length}</span>
                      </div>

                      {/* Time Ago */}
                      <div className="text-xs text-gray-500 lg:text-right">
                        {formatTimeAgo(issue.reportedAt)}
                      </div>
                    </div>
                  </div>

                  {/* Images Preview (if any) */}
                  {issue.images.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex space-x-2 overflow-x-auto">
                        {issue.images.slice(0, 3).map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Issue ${index + 1}`}
                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                          />
                        ))}
                        {issue.images.length > 3 && (
                          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-xs text-gray-500 flex-shrink-0">
                            +{issue.images.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Load More Button (for pagination in real app) */}
        {filteredAndSortedIssues.length > 0 && (
          <div className="text-center">
            <Button variant="outline" className="w-full sm:w-auto">
              Load More Issues
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}