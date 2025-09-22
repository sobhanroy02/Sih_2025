'use client'

import React from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { 
  ChatBubbleLeftIcon, 
  MapPinIcon, 
  ChartBarIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'

export default function LandingPage() {
  const features = [
    {
      icon: ChatBubbleLeftIcon,
      title: "Easy Reporting",
      description: "Report municipal issues with just a few taps. Add photos, location, and detailed descriptions."
    },
    {
      icon: MapPinIcon,
      title: "Location Tracking",
      description: "GPS-enabled location tracking ensures your reports reach the right department quickly."
    },
    {
      icon: ChartBarIcon,
      title: "Progress Tracking",
      description: "Follow your reported issues from submission to resolution with real-time updates."
    }
  ]

  const stats = [
    { label: "Issues Resolved", value: "12,847", trend: "+15%" },
    { label: "Active Citizens", value: "8,392", trend: "+22%" },
    { label: "Avg Response Time", value: "2.3 days", trend: "-18%" }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-teal-600 py-20 sm:py-32">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl font-heading">
              Your Voice, Your City, 
              <span className="block text-yellow-300">Your Impact</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-100 sm:text-xl">
              Report issues, track resolutions and collaborate—everything you need to make local impact is here.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button 
                  size="xl" 
                  className="bg-white text-primary-600 hover:bg-gray-50 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                >
                  Get Started
                </Button>
              </Link>
              <Button 
                size="xl" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-primary-600 transition-all duration-200"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 animate-bounce-gentle">
          <div className="rounded-full bg-white/10 p-3">
            <MapPinIcon className="h-6 w-6 text-white" />
          </div>
        </div>
        <div className="absolute top-32 right-20 animate-pulse-slow">
          <div className="rounded-full bg-white/10 p-3">
            <ChatBubbleLeftIcon className="h-6 w-6 text-white" />
          </div>
        </div>
        <div className="absolute bottom-20 left-20 animate-bounce-gentle" style={{ animationDelay: '1s' }}>
          <div className="rounded-full bg-white/10 p-3">
            <CheckCircleIcon className="h-6 w-6 text-white" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl font-heading">
              Everything you need for civic engagement
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Powerful features designed to make reporting and tracking municipal issues simple and effective.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-medium transition-all duration-300 transform hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-primary-600 to-teal-500 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white font-heading">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl font-heading">
              Making real impact in communities
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              See how CitiZen is transforming civic engagement across municipalities.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-8">
                  <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 font-heading">
                    {stat.value}
                  </div>
                  <div className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                    {stat.label}
                  </div>
                  <div className="mt-1 text-sm text-green-600 dark:text-green-400">
                    {stat.trend} from last month
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl font-heading">
              How CitiZen Works
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Simple steps to make your voice heard and create positive change in your community.
            </p>
          </div>
          
          <div className="grid gap-8 lg:grid-cols-4">
            {[
              { step: "1", title: "Sign Up", desc: "Create your account and verify your location", icon: UserGroupIcon },
              { step: "2", title: "Report Issue", desc: "Take a photo and describe the municipal issue", icon: ChatBubbleLeftIcon },
              { step: "3", title: "Track Progress", desc: "Follow updates as officials work on resolution", icon: ClockIcon },
              { step: "4", title: "See Results", desc: "Get notified when your issue is resolved", icon: CheckCircleIcon }
            ].map((item, index) => (
              <div key={index} className="relative text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 font-bold text-xl">
                  {item.step}
                </div>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-primary-600 to-teal-500">
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white font-heading">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {item.desc}
                </p>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full">
                    <div className="h-0.5 bg-gradient-to-r from-primary-300 to-teal-300 dark:from-primary-700 dark:to-teal-700" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-teal-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl font-heading">
            Ready to make a difference?
          </h2>
          <p className="mt-4 text-lg text-gray-100">
            Join thousands of citizens already using CitiZen to improve their communities.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button 
                size="xl" 
                className="bg-white text-primary-600 hover:bg-gray-50 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              >
                Get Started Today
              </Button>
            </Link>
            <Button 
              size="xl" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-primary-600 transition-all duration-200"
            >
              Download App
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-primary-600 to-teal-500">
                  <GlobeAltIcon className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white font-heading">CitiZen</span>
              </div>
              <p className="text-gray-400 mb-4">
                Empowering citizens to create positive change in their communities through technology and collaboration.
              </p>
              <div className="flex space-x-4">
                <ShieldCheckIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-400">Privacy Protected</span>
                <DevicePhoneMobileIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-400">Mobile Ready</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/integrations" className="hover:text-white transition-colors">Integrations</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2024 CitiZen. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
