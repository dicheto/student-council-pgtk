'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar as CalendarIcon, MapPin, Clock, User, Mail, Phone } from 'lucide-react'
import { format } from 'date-fns'
import { Event } from '@/types/events'
import { AddToCalendarButtons } from './AddToCalendarButtons'

interface EventModalProps {
  event: Event
  onClose: () => void
}

export function EventModal({ event, onClose }: EventModalProps) {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="event-title"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10"
            aria-label="Затвори"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="mb-6">
              <h2
                id="event-title"
                className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
              >
                {event.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {event.description}
              </p>
            </div>

            {/* Event Details */}
            <div className="space-y-4 mb-6">
              <div className="flex items-start space-x-3">
                <CalendarIcon className="w-5 h-5 text-primary dark:text-primary-light mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Дата и час
                  </p>
                  <p className="text-gray-900 dark:text-white">
                    {format(event.startDate, 'EEEE, d MMMM yyyy')}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {format(event.startDate, 'HH:mm')} - {format(event.endDate, 'HH:mm')}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary dark:text-primary-light mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Място
                  </p>
                  <p className="text-gray-900 dark:text-white">
                    {event.location}
                  </p>
                </div>
              </div>

              {event.organizer && (
                <div className="flex items-start space-x-3">
                  <User className="w-5 h-5 text-primary dark:text-primary-light mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Организатор
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {event.organizer}
                    </p>
                  </div>
                </div>
              )}

              {(event.contactEmail || event.contactPhone) && (
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-primary dark:text-primary-light mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Контакт
                    </p>
                    {event.contactEmail && (
                      <a
                        href={`mailto:${event.contactEmail}`}
                        className="text-primary dark:text-primary-light hover:underline block"
                      >
                        {event.contactEmail}
                      </a>
                    )}
                    {event.contactPhone && (
                      <a
                        href={`tel:${event.contactPhone}`}
                        className="text-primary dark:text-primary-light hover:underline block"
                      >
                        {event.contactPhone}
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Add to Calendar Buttons */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <AddToCalendarButtons event={event} />
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
