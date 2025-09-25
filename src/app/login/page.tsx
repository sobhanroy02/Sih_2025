'use client'

import React, { useState } from 'react'
import Image from 'next/image'
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

type UserType = 'citizen' | 'admin' | 'worker'

export default function LoginPage() {
  const [userType, setUserType] = useState<UserType>('citizen')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const router = useRouter()
  const { login } = useAuthStore()
  
  const { register, handleSubmit, formState: { errors } } = useForm()
  
  const onSubmit = async (data: Record<string, unknown>) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Create mock user object
      const user = {
        id: crypto.randomUUID(),
        email: data.email as string,
        name: 'John Doe',
        role: userType,
        municipality: 'Mumbai Municipal Corporation',
        city: 'Mumbai',
        ward: '12',
        verified: true,
        phone: '+91 9876543210',
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
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  const userTypes = [
    {
      id: 'citizen',
      label: 'Citizen',
      description: 'Access your citizen dashboard',
      icon: UserIcon,
    },
    {
      id: 'admin',
      label: 'Municipal Admin',
      description: 'Access admin control panel',
      icon: ShieldCheckIcon,
    },
    {
      id: 'worker',
      label: 'Field Worker',
      description: 'Access worker assignments',
      icon: WrenchScrewdriverIcon,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="flex min-h-[calc(100vh-4rem)] items-stretch py-12 px-4 sm:px-6 lg:px-10 gap-12 flex-col lg:flex-row">
        {/* Marketing Images Section */}
        <div className="relative flex-1 max-w-xl mx-auto w-full lg:block hidden">
          <div className="grid grid-cols-2 gap-4 h-full content-start">
            <div className="relative h-56 rounded-xl overflow-hidden shadow ring-1 ring-black/10 bg-white/40 backdrop-blur-sm">
              <Image 
                src="/cleanest-cities-in-india-1.jpg" 
                alt="Cleanest city visual"
                fill 
                sizes="(max-width:1024px) 50vw, 25vw" 
                className="object-cover" 
                priority
              />
            </div>
            <div className="relative h-56 rounded-xl overflow-hidden shadow ring-1 ring-black/10 bg-white/40 backdrop-blur-sm mt-8">
              <Image 
                src="/cleanest-cities-in-india-2.jpg" 
                alt="Sustainable green city"
                fill 
                sizes="(max-width:1024px) 50vw, 25vw" 
                className="object-cover" 
              />
            </div>
            <div className="col-span-2 mt-8 text-center px-4">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent font-heading">Cleaner • Smarter • Connected</h2>
              <p className="mt-3 text-sm text-gray-600">Unified login for citizens, administrators & field workers.</p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md space-y-8 mx-auto flex flex-col justify-center">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-primary-600 to-teal-500">
                <GlobeAltIcon className="h-6 w-6 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-heading">
              Welcome Back
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Sign in to your CitiZen account
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">Sign In</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* User Type Selection */}
              <div className="grid grid-cols-3 gap-2">
                {userTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setUserType(type.id as UserType)}
                    className={`p-3 rounded-lg border-2 transition-all text-center ${
                      userType === type.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                    }`}
                  >
                    <type.icon className={`h-5 w-5 mx-auto mb-1 ${
                      userType === type.id ? 'text-primary-600' : 'text-gray-400'
                    }`} />
                    <div className={`text-xs font-medium ${
                      userType === type.id ? 'text-primary-600' : 'text-gray-900 dark:text-white'
                    }`}>
                      {type.label}
                    </div>
                  </button>
                ))}
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label={`${userType === 'citizen' ? 'User ID or Email' : userType === 'admin' ? 'Admin ID' : 'Worker ID'}`}
                  {...register('email', { required: 'This field is required' })}
                  error={errors.email?.message as string}
                  placeholder={`Enter your ${userType === 'citizen' ? 'email or user ID' : userType + ' ID'}`}
                />

                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  {...register('password', { required: 'Password is required' })}
                  error={errors.password?.message as string}
                  placeholder="Enter your password"
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

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary-600"
                      {...register('rememberMe')}
                    />
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      Remember me
                    </span>
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary-600 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  loading={isLoading}
                  variant="gradient"
                >
                  Sign In
                </Button>

                {/* OAuth Buttons */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    // Mock Google OAuth
                    console.log('Google OAuth clicked')
                  }}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </Button>

                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" className="text-primary-600 hover:underline font-medium">
                      Sign up here
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