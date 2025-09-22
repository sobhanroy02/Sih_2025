'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Header } from '@/components/layout/Header'
import { useAuthStore } from '@/store'
import { 
  UserIcon, 
  ShieldCheckIcon, 
  WrenchScrewdriverIcon,
  GlobeAltIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'

// User type definitions
type UserType = 'citizen' | 'admin' | 'worker'

export default function SignupPage() {
  const [userType, setUserType] = useState<UserType>('citizen')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const router = useRouter()
  const { login } = useAuthStore()
  
  const form = useForm({
    mode: 'onChange'
  })
  
  const { register, handleSubmit, formState: { errors }, reset } = form
  
  // Reset form when user type changes
  React.useEffect(() => {
    reset()
  }, [userType, reset])
  
  const onSubmit = async (data: Record<string, unknown>) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Create user object
      const user = {
        id: crypto.randomUUID(),
        email: data.email as string,
        name: data.fullName as string,
        role: userType,
        municipality: data.municipality as string,
        city: data.city as string,
        ward: data.ward as string,
        department: data.department as string,
        verified: false,
        phone: data.phone as string,
      }
      
      // Login user
      login(user)
      
      // Redirect based on user type
      switch (userType) {
        case 'admin':
          router.push('/admin')
          break
        case 'worker':
          router.push('/worker')
          break
        default:
          router.push('/dashboard')
      }
    } catch (error) {
      console.error('Signup error:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  const userTypes = [
    {
      id: 'citizen',
      label: 'Citizen',
      description: 'Report issues and track resolutions in your community',
      icon: UserIcon,
    },
    {
      id: 'admin',
      label: 'Municipal Admin',
      description: 'Manage issues and coordinate with departments',
      icon: ShieldCheckIcon,
    },
    {
      id: 'worker',
      label: 'Field Worker',
      description: 'Receive assignments and update issue status',
      icon: WrenchScrewdriverIcon,
    },
  ]
  
  const municipalities = [
    'Mumbai Municipal Corporation',
    'Delhi Municipal Corporation',
    'Bangalore Municipal Corporation',
    'Pune Municipal Corporation',
    'Chennai Municipal Corporation',
  ]
  
  const departments = [
    'Public Works',
    'Water Management',
    'Waste Management',
    'Street Lighting',
    'Transportation',
    'Parks & Recreation',
  ]
  
  const skills = [
    'Electrical Work',
    'Plumbing',
    'Road Repair',
    'Waste Collection',
    'Street Cleaning',
    'Tree Maintenance',
    'Traffic Management',
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-primary-600 to-teal-500">
                <GlobeAltIcon className="h-6 w-6 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-heading">
              Join CitiZen Community
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Create your account to start making a difference in your community
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">Choose Your Role</CardTitle>
            </CardHeader>
            <CardContent>
              {/* User Type Selection */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {userTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setUserType(type.id as UserType)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      userType === type.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                    }`}
                  >
                    <type.icon className={`h-6 w-6 mb-2 ${
                      userType === type.id ? 'text-primary-600' : 'text-gray-400'
                    }`} />
                    <h3 className={`font-medium ${
                      userType === type.id ? 'text-primary-600' : 'text-gray-900 dark:text-white'
                    }`}>
                      {type.label}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {type.description}
                    </p>
                  </button>
                ))}
              </div>

              {/* Signup Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Full Name *"
                    {...register('fullName')}
                    error={errors.fullName?.message as string}
                    placeholder="Enter your full name"
                  />
                  
                  <Input
                    label="Email Address *"
                    type="email"
                    {...register('email')}
                    error={errors.email?.message as string}
                    placeholder="Enter your email"
                  />
                  
                  <Input
                    label="Phone Number *"
                    {...register('phone')}
                    error={errors.phone?.message as string}
                    placeholder="Enter your phone number"
                  />
                  
                  {/* Role-specific fields */}
                  {userType === 'admin' && (
                    <Input
                      label="Admin ID *"
                      {...register('adminId')}
                      error={errors.adminId?.message as string}
                      placeholder="Enter your admin ID"
                    />
                  )}
                  
                  {userType === 'worker' && (
                    <Input
                      label="Worker ID *"
                      {...register('workerId')}
                      error={errors.workerId?.message as string}
                      placeholder="Enter your worker ID"
                    />
                  )}
                </div>

                {/* Location Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Municipality *
                    </label>
                    <select
                      {...register('municipality')}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
                    >
                      <option value="">Select Municipality</option>
                      {municipalities.map(municipality => (
                        <option key={municipality} value={municipality}>
                          {municipality}
                        </option>
                      ))}
                    </select>
                    {errors.municipality && (
                      <p className="mt-1 text-sm text-red-600">{errors.municipality.message as string}</p>
                    )}
                  </div>
                  
                  <Input
                    label="City *"
                    {...register('city')}
                    error={errors.city?.message as string}
                    placeholder="Enter your city"
                  />
                  
                  <Input
                    label="Ward Number *"
                    {...register('ward')}
                    error={errors.ward?.message as string}
                    placeholder="Enter ward number"
                  />
                </div>

                {/* Department for Admin */}
                {userType === 'admin' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Department *
                    </label>
                    <select
                      {...register('department')}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                    {errors.department && (
                      <p className="mt-1 text-sm text-red-600">{errors.department.message as string}</p>
                    )}
                  </div>
                )}

                {/* Skills for Worker */}
                {userType === 'worker' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Skills/Specialization *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {skills.map(skill => (
                        <label key={skill} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            value={skill}
                            {...register('skills')}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm">{skill}</span>
                        </label>
                      ))}
                    </div>
                    {errors.skills && (
                      <p className="mt-1 text-sm text-red-600">{errors.skills.message as string}</p>
                    )}
                  </div>
                )}

                {/* Password Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Password *"
                    type={showPassword ? "text" : "password"}
                    {...register('password')}
                    error={errors.password?.message as string}
                    placeholder="Create a password"
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                      </button>
                    }
                  />
                  
                  <Input
                    label="Confirm Password *"
                    type={showConfirmPassword ? "text" : "password"}
                    {...register('confirmPassword')}
                    error={errors.confirmPassword?.message as string}
                    placeholder="Confirm your password"
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeSlashIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                      </button>
                    }
                  />
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    {...register('termsAccepted')}
                    className="mt-1 rounded border-gray-300"
                  />
                  <label className="text-sm text-gray-600 dark:text-gray-400">
                    I agree to the{' '}
                    <Link href="/terms" className="text-primary-600 hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-primary-600 hover:underline">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                {errors.termsAccepted && (
                  <p className="text-sm text-red-600">{errors.termsAccepted.message as string}</p>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  loading={isLoading}
                  variant="gradient"
                >
                  Create Account
                </Button>

                {/* Login Link */}
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Already have an account?{' '}
                    <Link href="/login" className="text-primary-600 hover:underline font-medium">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}