'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { LanguageIcon } from '@heroicons/react/24/outline'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden bg-transparent">
                <img
                  src="/icons/logo.png"
                  width={32}
                  height={32}
                  alt="CitiZen App Logo"
                  className="h-8 w-8 object-contain"
                />
              </div>
              <span className="text-xl font-bold font-heading text-gray-900 dark:text-white">
                CitiZen
              </span>
            </Link>
          </div>

          {/* Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/features" 
              className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              Features
            </Link>
            <Link 
              href="/about" 
              className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <Button variant="ghost" size="icon" aria-label="Select language">
              <LanguageIcon className="h-4 w-4" />
            </Button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Auth Buttons */}
            <div className="hidden sm:flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/login">
                <Button variant="gradient">Get Started</Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              aria-label="Open menu"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}