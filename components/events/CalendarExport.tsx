'use client'

import { motion } from 'framer-motion'
import { Calendar as CalendarIcon, Download } from 'lucide-react'
import { Event } from '@/types/events'
import { format } from 'date-fns'

interface CalendarExportProps {
  event: Event
}

export function CalendarExport({ event }: CalendarExportProps) {
  // Generate Google Calendar URL
  const generateGoogleCalendarUrl = () => {
    const startDate = event.startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    const endDate = event.endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: `${startDate}/${endDate}`,
      details: event.description,
      location: event.location,
    })

    return `https://calendar.google.com/calendar/render?${params.toString()}`
  }

  // Generate .ics file for Apple Calendar
  const generateICSFile = async () => {
    try {
      const response = await fetch('/api/events/ics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: event.title,
          description: event.description,
          startDate: event.startDate.toISOString(),
          endDate: event.endDate.toISOString(),
          location: event.location,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate ICS file')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${event.title.replace(/[^a-z0-9]/gi, '_')}.ics`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error generating ICS:', error)
      alert('Грешка при генериране на календар файл')
    }
  }

  const handleGoogleCalendar = () => {
    window.open(generateGoogleCalendarUrl(), '_blank', 'noopener,noreferrer')
  }

  const handleAppleCalendar = () => {
    generateICSFile()
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Добави към календар
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Google Calendar Button */}
        <motion.button
          onClick={handleGoogleCalendar}
          className="flex items-center justify-center space-x-3 px-6 py-4 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-xl font-semibold text-gray-900 dark:text-white hover:border-primary dark:hover:border-primary-light transition-all shadow-sm"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          aria-label="Добави в Google Calendar"
        >
          <CalendarIcon className="w-5 h-5 text-primary dark:text-primary-light" />
          <span>Google Calendar</span>
        </motion.button>

        {/* Apple Calendar Button */}
        <motion.button
          onClick={handleAppleCalendar}
          className="flex items-center justify-center space-x-3 px-6 py-4 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-xl font-semibold text-gray-900 dark:text-white hover:border-primary dark:hover:border-primary-light transition-all shadow-sm"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          aria-label="Добави в Apple Calendar"
        >
          <Download className="w-5 h-5 text-primary dark:text-primary-light" />
          <span>Apple Calendar</span>
        </motion.button>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        .ics файлът работи и с Outlook, Thunderbird и други календарни приложения
      </p>
    </div>
  )
}
