'use client'

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { 
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  BookOpenIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  CogIcon
} from '@heroicons/react/24/outline'

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
}

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)

  const categories = [
    { id: 'all', name: 'All Topics', icon: '📋' },
    { id: 'reporting', name: 'Reporting Issues', icon: '📝' },
    { id: 'account', name: 'Account & Profile', icon: '👤' },
    { id: 'community', name: 'Community Features', icon: '🏘️' },
    { id: 'technical', name: 'Technical Support', icon: '⚙️' },
    { id: 'general', name: 'General Questions', icon: '❓' },
  ]

  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'How do I report a new issue?',
      answer: 'To report a new issue, click on the "Report Issue" button in your dashboard or navigate to the Report page. Fill out the form with details about the issue, including its location, category, and description. You can also attach photos to help illustrate the problem.',
      category: 'reporting'
    },
    {
      id: '2',
      question: 'What types of issues can I report?',
      answer: 'You can report various municipal issues including potholes, street light problems, garbage/waste management issues, water supply problems, graffiti, road damage, and other civic concerns that affect your community.',
      category: 'reporting'
    },
    {
      id: '3',
      question: 'How long does it take for issues to be resolved?',
      answer: 'Resolution times vary depending on the type and severity of the issue. Critical issues are typically addressed within 24-48 hours, while non-urgent matters may take 1-2 weeks. You\'ll receive notifications about the status of your reported issues.',
      category: 'reporting'
    },
    {
      id: '4',
      question: 'Can I track the progress of my reported issues?',
      answer: 'Yes! You can track all your reported issues in your dashboard. Each issue shows its current status (Open, In Progress, Resolved, or Closed) and you\'ll receive notifications when the status changes.',
      category: 'reporting'
    },
    {
      id: '5',
      question: 'How do I update my profile information?',
      answer: 'Go to your Profile page and click the "Edit" button. You can update your personal information, contact details, and location settings. Don\'t forget to save your changes.',
      category: 'account'
    },
    {
      id: '6',
      question: 'Is my personal information secure?',
      answer: 'Yes, we take data security seriously. Your personal information is encrypted and stored securely. We only share necessary information with relevant municipal departments to resolve your reported issues.',
      category: 'account'
    },
    {
      id: '7',
      question: 'How do I reset my password?',
      answer: 'On the login page, click "Forgot Password" and enter your email address. You\'ll receive a password reset link in your email. Follow the instructions to create a new password.',
      category: 'account'
    },
    {
      id: '8',
      question: 'What does upvoting an issue do?',
      answer: 'Upvoting shows community support for an issue and helps prioritize it. Issues with more upvotes are often given higher priority by municipal departments. You can upvote issues in the Community Issues page.',
      category: 'community'
    },
    {
      id: '9',
      question: 'Can I comment on other people\'s issues?',
      answer: 'Currently, the platform focuses on upvoting and supporting issues. However, you can show support by upvoting issues that affect your community.',
      category: 'community'
    },
    {
      id: '10',
      question: 'How do I view issues in my area?',
      answer: 'The Community Issues page shows all issues reported in your municipality. You can filter by category, status, and use the search function to find specific issues or locations.',
      category: 'community'
    },
    {
      id: '11',
      question: 'The app is running slowly. What can I do?',
      answer: 'Try refreshing the page or clearing your browser cache. Ensure you have a stable internet connection. If problems persist, contact our technical support team.',
      category: 'technical'
    },
    {
      id: '12',
      question: 'Can I use this app on my mobile device?',
      answer: 'Yes! CitiZen is a Progressive Web App (PWA) that works seamlessly on both desktop and mobile devices. You can even install it on your phone for quick access.',
      category: 'technical'
    },
    {
      id: '13',
      question: 'What browsers are supported?',
      answer: 'CitiZen works best on modern browsers including Chrome, Firefox, Safari, and Edge. Make sure your browser is updated to the latest version for the best experience.',
      category: 'technical'
    },
    {
      id: '14',
      question: 'How does CitiZen help improve my community?',
      answer: 'CitiZen creates a direct communication channel between citizens and municipal authorities, making it easier to report and track community issues. This leads to faster resolution times and more responsive local government.',
      category: 'general'
    },
    {
      id: '15',
      question: 'Is CitiZen free to use?',
      answer: 'Yes, CitiZen is completely free for all citizens. Our goal is to improve civic engagement and community welfare through technology.',
      category: 'general'
    }
  ]

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id)
  }

  const quickActions = [
    {
      title: 'Report an Issue',
      description: 'Quickly report a problem in your community',
      icon: ExclamationTriangleIcon,
      href: '/report',
      color: 'bg-red-500 hover:bg-red-600'
    },
    {
      title: 'Browse Community Issues',
      description: 'See what others have reported and show support',
      icon: QuestionMarkCircleIcon,
      href: '/community',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Update Profile',
      description: 'Keep your account information current',
      icon: CogIcon,
      href: '/profile',
      color: 'bg-green-500 hover:bg-green-600'
    }
  ]

  return (
    <DashboardLayout userType="citizen">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-heading">
            Help Center
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
            Find answers to common questions, learn how to use CitiZen effectively, and get the support you need.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action) => (
            <Card key={action.title} className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardContent className="p-6">
                <div 
                  className="text-center"
                  onClick={() => window.location.href = action.href}
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg text-white mb-4 transition-colors ${action.color}`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {action.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Categories */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search frequently asked questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Browse by Category
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

        {/* FAQ Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpenIcon className="h-5 w-5" />
                  <span>Frequently Asked Questions</span>
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {filteredFAQs.length} question{filteredFAQs.length !== 1 ? 's' : ''} found
                </p>
              </CardHeader>
              <CardContent>
                {filteredFAQs.length === 0 ? (
                  <div className="text-center py-8">
                    <QuestionMarkCircleIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No FAQs Found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Try adjusting your search terms or browse different categories.
                    </p>
                    <Button
                      onClick={() => {
                        setSearchTerm('')
                        setSelectedCategory('all')
                      }}
                      variant="outline"
                    >
                      Clear Search
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredFAQs.map((faq) => (
                      <div key={faq.id} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                        <button
                          onClick={() => toggleFAQ(faq.id)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <span className="font-medium text-gray-900 dark:text-white pr-4">
                            {faq.question}
                          </span>
                          {expandedFAQ === faq.id ? (
                            <ChevronUpIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                          ) : (
                            <ChevronDownIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                          )}
                        </button>
                        {expandedFAQ === faq.id && (
                          <div className="px-4 pb-4">
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Information Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ChatBubbleLeftRightIcon className="h-5 w-5" />
                  <span>Need More Help?</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Can&apos;t find what you&apos;re looking for? Our support team is here to help.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <EnvelopeIcon className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="text-sm font-medium">Email Support</div>
                      <div className="text-xs text-gray-500">support@citizen.gov</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <PhoneIcon className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="text-sm font-medium">Phone Support</div>
                      <div className="text-xs text-gray-500">1-800-CITIZEN</div>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <LightBulbIcon className="h-5 w-5" />
                  <span>Pro Tips</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                      📸 Include Photos
                    </div>
                    <div className="text-blue-600 dark:text-blue-300">
                      Issues with photos get resolved 40% faster
                    </div>
                  </div>
                  
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="font-medium text-green-800 dark:text-green-200 mb-1">
                      📍 Be Specific
                    </div>
                    <div className="text-green-600 dark:text-green-300">
                      Detailed locations help workers find issues quickly
                    </div>
                  </div>
                  
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="font-medium text-purple-800 dark:text-purple-200 mb-1">
                      👍 Support Others
                    </div>
                    <div className="text-purple-600 dark:text-purple-300">
                      Upvote issues that affect your community too
                    </div>
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