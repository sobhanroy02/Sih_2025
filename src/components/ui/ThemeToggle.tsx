'use client'

import React from 'react'
import { SunIcon as SunOutline, MoonIcon as MoonOutline, ComputerDesktopIcon as ComputerOutline } from '@heroicons/react/24/outline'
import { SunIcon as SunSolid, MoonIcon as MoonSolid, ComputerDesktopIcon as ComputerSolid } from '@heroicons/react/24/solid'
import { useTheme } from '@/contexts/ThemeContext'
import { Button } from './Button'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return (
          <span className="inline-flex items-center justify-center text-amber-500 dark:text-amber-400">
            <SunSolid className="h-4 w-4" />
          </span>
        )
      case 'dark':
        return (
          <span className="inline-flex items-center justify-center text-sky-500 dark:text-sky-400">
            <MoonSolid className="h-4 w-4" />
          </span>
        )
      case 'system':
        return (
          <span className="inline-flex items-center justify-center text-slate-500 dark:text-slate-300">
            <ComputerSolid className="h-4 w-4" />
          </span>
        )
      default:
        return <SunOutline className="h-4 w-4" />
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} theme`}
  className="relative overflow-hidden"
    >
      <div className="transition-transform duration-300">
        {getIcon()}
      </div>
    </Button>
  )
}