'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuthStore, useIssuesStore, type IssueCategory, type IssuePriority } from '@/store'
import { 
  MapPinIcon,
  PhotoIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface IssueFormData {
  category: string
  title: string
  description: string
  address: string
  landmarks?: string
  severity: string
  contactTime?: string
  coordinates?: { lat: number; lng: number }
}

export default function ReportIssuePage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { addIssue } = useIssuesStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [useCurrentLocation, setUseCurrentLocation] = useState(false)
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<IssueFormData>()

  const issueCategories = [
    { id: 'pothole', name: 'Pothole', icon: '🚧', description: 'Road damage and potholes' },
    { id: 'streetlight', name: 'Street Light', icon: '💡', description: 'Street lighting issues' },
    { id: 'garbage', name: 'Garbage/Waste', icon: '🗑️', description: 'Waste management problems' },
    { id: 'water', name: 'Water Issue', icon: '💧', description: 'Water supply or drainage' },
    { id: 'graffiti', name: 'Graffiti', icon: '🎨', description: 'Vandalism and graffiti' },
    { id: 'road', name: 'Road Damage', icon: '🛣️', description: 'General road maintenance' },
    { id: 'other', name: 'Other', icon: '📝', description: 'Other municipal issues' },
  ]

  const severityLevels = [
    { id: 'low', name: 'Low', color: 'bg-green-100 text-green-800 border-green-200' },
    { id: 'medium', name: 'Medium', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    { id: 'high', name: 'High', color: 'bg-orange-100 text-orange-800 border-orange-200' },
    { id: 'critical', name: 'Critical', color: 'bg-red-100 text-red-800 border-red-200' },
  ]

  const getCurrentLocation = () => {
    setUseCurrentLocation(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          // In a real app, you'd reverse geocode this to get an address
          setValue('address', `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)
          setValue('coordinates', { lat: latitude, lng: longitude })
        },
        (error) => {
          console.error('Error getting location:', error)
          setUseCurrentLocation(false)
        }
      )
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length + selectedImages.length > 5) {
      alert('Maximum 5 images allowed')
      return
    }

    setSelectedImages(prev => [...prev, ...files])
    
    // Create preview URLs
    files.forEach(file => {
      const url = URL.createObjectURL(file)
      setPreviewUrls(prev => [...prev, url])
    })
  }

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
    setPreviewUrls(prev => {
      URL.revokeObjectURL(prev[index])
      return prev.filter((_, i) => i !== index)
    })
  }

  const onSubmit = async (data: IssueFormData) => {
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      const newIssue = {
        id: crypto.randomUUID(),
        title: data.title,
        description: data.description,
        category: data.category as IssueCategory,
        priority: data.severity as IssuePriority,
        status: 'open' as const,
        location: {
          address: data.address,
          coordinates: data.coordinates || { lat: 0, lng: 0 },
        },
        images: previewUrls, // In real app, upload to server first
        reportedBy: user?.id || '',
        reportedAt: new Date(),
        updatedAt: new Date(),
        upvotes: 0,
        comments: [],
      }

      addIssue(newIssue)
      router.push('/dashboard')
    } catch (error) {
      console.error('Error submitting issue:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DashboardLayout userType="citizen">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-heading">
            Report an Issue
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Help improve your community by reporting municipal issues
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Issue Category Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Issue Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {issueCategories.map((category) => (
                  <label key={category.id} className="cursor-pointer">
                    <input
                      type="radio"
                      value={category.id}
                      {...register('category', { required: 'Please select a category' })}
                      className="sr-only"
                    />
                    <div className={`p-4 rounded-lg border-2 transition-all text-center hover:border-primary-300 ${
                      watch('category') === category.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}>
                      <div className="text-2xl mb-2">{category.icon}</div>
                      <div className="font-medium text-sm">{category.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{category.description}</div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.category && (
                <p className="mt-2 text-sm text-red-600">{errors.category.message as string}</p>
              )}
            </CardContent>
          </Card>

          {/* Location Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPinIcon className="h-5 w-5" />
                <span>Location</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-4">
                <Button
                  type="button"
                  onClick={getCurrentLocation}
                  variant={useCurrentLocation ? "default" : "outline"}
                  className="flex items-center space-x-2"
                >
                  <MapPinIcon className="h-4 w-4" />
                  <span>Use Current Location</span>
                </Button>
              </div>
              
              <Input
                label="Address/Location Description"
                {...register('address', { required: 'Location is required' })}
                error={errors.address?.message as string}
                placeholder="Enter the address or describe the location"
              />
              
              <Input
                label="Nearby Landmarks (Optional)"
                {...register('landmarks')}
                placeholder="e.g., Near Central Park, opposite to Mall"
              />
            </CardContent>
          </Card>

          {/* Issue Details */}
          <Card>
            <CardHeader>
              <CardTitle>Issue Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Issue Title"
                {...register('title', { required: 'Title is required', maxLength: { value: 100, message: 'Title must be less than 100 characters' } })}
                error={errors.title?.message as string}
                placeholder="Brief description of the issue"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  {...register('description', { required: 'Description is required' })}
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
                  placeholder="Provide detailed information about the issue..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message as string}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Severity Level
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {severityLevels.map((level) => (
                    <label key={level.id} className="cursor-pointer">
                      <input
                        type="radio"
                        value={level.id}
                        {...register('severity', { required: 'Please select severity' })}
                        className="sr-only"
                      />
                      <div className={`p-3 rounded-lg border-2 text-center transition-all ${
                        watch('severity') === level.id
                          ? level.color + ' border-current'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <div className="font-medium">{level.name}</div>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.severity && (
                  <p className="mt-1 text-sm text-red-600">{errors.severity.message as string}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Best Time to Contact
                </label>
                <Input
                  type="time"
                  {...register('contactTime')}
                  placeholder="When officials can reach you"
                />
              </div>
            </CardContent>
          </Card>

          {/* Media Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PhotoIcon className="h-5 w-5" />
                <span>Photos & Videos</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                <div className="text-center">
                  <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-white">
                        Upload photos or videos
                      </span>
                      <span className="mt-2 block text-sm text-gray-500">
                        PNG, JPG, GIF up to 10MB (Max 5 files)
                      </span>
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      className="sr-only"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleImageUpload}
                    />
                  </div>
                </div>
              </div>

              {/* Image Previews */}
              {previewUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Section */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button
                  type="submit"
                  loading={isSubmitting}
                  className="flex-1"
                  variant="gradient"
                >
                  Submit Report
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
              
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <ExclamationTriangleIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <p className="font-medium">Before submitting:</p>
                    <ul className="mt-1 list-disc list-inside space-y-1">
                      <li>Ensure all information is accurate</li>
                      <li>Photos should clearly show the issue</li>
                      <li>You&apos;ll receive updates via notifications</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  )
}