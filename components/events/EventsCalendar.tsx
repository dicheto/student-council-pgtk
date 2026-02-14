'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/contexts/LanguageContext'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, getDay } from 'date-fns'
import { bg } from 'date-fns/locale'
import { EventModal } from './EventModal'
import { Event } from '@/types/events'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

type LocalizedText = string | { bg?: string; en?: string } | null

interface EventRow {
  id: string
  title: LocalizedText
  slug: string
  description: LocalizedText
  start_date: string
  end_date: string | null
  location: string | null
  status: string
}

interface EventWithSlug extends Event {
  slug?: string
}

function pickLocale(value: LocalizedText, locale: 'bg' | 'en') {
  if (!value) return ''
  if (typeof value === 'string') return value
  return value?.[locale] || value?.bg || value?.en || ''
}

export function EventsCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [events, setEvents] = useState<EventWithSlug[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const { language } = useLanguage()
  const locale = language

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('status', 'published')
          .order('start_date', { ascending: true })

        if (error) throw error

        if (data) {
          const mappedEvents: EventWithSlug[] = (data as EventRow[]).map((row, index) => ({
            id: index + 1, // Use index as fallback ID
            title: pickLocale(row.title, locale),
            description: pickLocale(row.description, locale),
            startDate: new Date(row.start_date),
            endDate: row.end_date ? new Date(row.end_date) : new Date(new Date(row.start_date).getTime() + 3600000),
            location: row.location || '',
            category: 'other',
            slug: row.slug,
          }))
          setEvents(mappedEvents)
        }
      } catch (error) {
        console.error('Error fetching events:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Първи ден от месеца за да знаем от кой ден започва
  const startDayOfWeek = getDay(monthStart)
  
  // Създаваме празни клетки за дните преди началото на месеца
  const emptyDays = Array.from({ length: startDayOfWeek === 0 ? 6 : startDayOfWeek - 1 }, (_, i) => i)

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      isSameDay(event.startDate, date)
    )
  }

  const handleDateClick = (date: Date) => {
    const events = getEventsForDate(date)
    if (events.length > 0) {
      setSelectedEvent(events[0])
    } else {
      setSelectedDate(date)
    }
  }

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд']

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <motion.button
            onClick={prevMonth}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Предишен месец"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>

          <motion.h2
            className="text-2xl font-bold text-gray-900 dark:text-white"
            key={format(currentMonth, 'yyyy-MM')}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {format(currentMonth, 'MMMM yyyy', { locale: bg })}
          </motion.h2>

          <motion.button
            onClick={nextMonth}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Следващ месец"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {/* Week Day Headers */}
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-semibold text-gray-600 dark:text-gray-400 py-2"
            >
              {day}
            </div>
          ))}

          {/* Empty cells for days before month start */}
          {emptyDays.map((_, index) => (
            <div key={`empty-${index}`} className="aspect-square" />
          ))}

          {/* Calendar Days */}
          {daysInMonth.map((day) => {
            const dayEvents = getEventsForDate(day)
            const isToday = isSameDay(day, new Date())
            const isSelected = selectedDate && isSameDay(day, selectedDate)

            return (
              <motion.button
                key={day.toISOString()}
                onClick={() => handleDateClick(day)}
                className={`
                  aspect-square rounded-lg p-1 sm:p-2 text-xs sm:text-sm font-medium
                  transition-all relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                  ${isToday 
                    ? 'bg-primary text-white ring-2 ring-primary ring-offset-2' 
                    : isSelected
                    ? 'bg-primary/20 text-primary dark:bg-primary/30 dark:text-primary-light'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
                  }
                  ${dayEvents.length > 0 ? 'border-2 border-primary/50' : ''}
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={`${format(day, 'd MMMM yyyy')}${dayEvents.length > 0 ? `, ${dayEvents.length} събития` : ''}`}
                role="button"
                tabIndex={0}
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <span>{format(day, 'd')}</span>
                  {dayEvents.length > 0 && (
                    <div className="flex gap-0.5 mt-1">
                      {dayEvents.slice(0, 3).map((event) => (
                        <div
                          key={event.id}
                          className="w-1 h-1 rounded-full bg-current opacity-60"
                        />
                      ))}
                      {dayEvents.length > 3 && (
                        <span className="text-xs">+{dayEvents.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Upcoming Events List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Предстоящи Събития
        </h3>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : events.length === 0 ? (
          <p className="text-center py-8 text-gray-500 dark:text-gray-400">
            Няма предстоящи събития
          </p>
        ) : (
          <div className="space-y-3">
            {events
              .filter(event => event.startDate >= new Date())
              .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
              .slice(0, 5)
              .map((event) => (
                <Link key={`${event.id}-${event.slug}`} href={`/events/${event.slug || event.id}`}>
                  <motion.div
                    className="w-full text-left p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700 cursor-pointer"
                    whileHover={{ x: 4 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {event.title}
                        </h4>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center">
                            <CalendarIcon className="w-4 h-4 mr-1" />
                            {format(event.startDate, 'd MMM yyyy, HH:mm', { locale: bg })}
                          </span>
                          {event.location && <span>{event.location}</span>}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </motion.div>
                </Link>
              ))}
          </div>
        )}
      </div>

      {/* Event Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <EventModal
            event={selectedEvent}
            onClose={() => {
              setSelectedEvent(null)
              setSelectedDate(null)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
