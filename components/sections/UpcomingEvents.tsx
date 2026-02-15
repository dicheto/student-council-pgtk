'use client'

import { motion } from 'framer-motion'
import { Calendar, MapPin, Clock, ArrowRight, Sparkles, CalendarDays, ExternalLink } from 'lucide-react'
import { format, isAfter } from 'date-fns'
import { bg } from 'date-fns/locale'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useLanguage } from '@/lib/contexts/LanguageContext'
import { useDictionary } from '@/lib/hooks/useDictionary'

interface Event {
  id: string
  title: string | { bg: string; en: string }
  description: string | { bg: string; en: string }
  slug: string
  start_date: string
  end_date?: string
  location?: string
  featured: boolean
}

// Fallback events when database is empty
const fallbackEvents: Event[] = [
  {
    id: '1',
    title: 'Годишно събрание на ученическия съвет',
    description: 'Присъединете се към нас за нашето годишно събрание, където ще обсъдим плановете за годината и ще изберем нови членове на съвета.',
    slug: 'godishno-sabranie',
    start_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'Актови салон',
    featured: true,
  },
  {
    id: '2',
    title: 'Благотворителен базар',
    description: 'Подкрепете нашата благотворителна инициатива с ръчно изработени изделия и вкусни лакомства.',
    slug: 'blagotvoritelen-bazar',
    start_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'Школен двор',
    featured: false,
  },
  {
    id: '3',
    title: 'Културен фестивал',
    description: 'Празнуваме разнообразието и културата с музика, танци и изкуство.',
    slug: 'kulturen-festival',
    start_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'Многофункционална зала',
    featured: false,
  },
]

function EventCard({ event, index, isFeatured }: { event: Event; index: number; isFeatured: boolean }) {
  const { language } = useLanguage()
  const { t } = useDictionary('events')
  const title = typeof event.title === 'object' ? (event.title[language] || event.title.bg || event.title.en) : event.title
  const description = typeof event.description === 'object' ? (event.description[language] || event.description.bg || event.description.en) : event.description
  const eventDate = new Date(event.start_date)
  const isUpcoming = isAfter(eventDate, new Date())

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`group relative ${isFeatured ? 'md:col-span-2' : ''}`}
    >
      <motion.div
        className={`relative h-full rounded-3xl overflow-hidden ${
          isFeatured 
            ? 'bg-gradient-to-br from-primary/10 to-primary-light/5 border-2 border-primary/20' 
            : 'bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700'
        } p-6`}
        whileHover={{ y: -8, scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        />

        {/* Featured badge */}
        {isFeatured && (
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-accent/20 to-accent-light/20 text-accent-dark dark:text-accent-light text-xs font-bold mb-4 border border-accent/30"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-3.5 h-3.5" />
            </motion.div>
            {t('featured_badge', 'Препоръчано')}
          </motion.div>
        )}

        {/* Date badge */}
        <div className="flex items-start gap-4 mb-4">
          <motion.div 
            className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex flex-col items-center justify-center text-white shadow-lg shadow-primary/20"
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <span className="text-2xl font-bold leading-none">
              {format(eventDate, 'd')}
            </span>
            <span className="text-xs uppercase tracking-wider opacity-80">
              {format(eventDate, 'MMM', { locale: bg })}
            </span>
          </motion.div>
          
          <div className="flex-1">
            <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white mb-1 group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
              {title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{format(eventDate, 'HH:mm')}</span>
              {event.location && (
                <>
                  <span>•</span>
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{event.location}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-2">
          {description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            {isUpcoming ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                {t('status_upcoming', 'Предстои')}
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 text-xs font-medium">
                {t('status_finished', 'Приключило')}
              </span>
            )}
          </div>
          
          <Link href={`/events/${event.slug}`}>
            <motion.span
              className="inline-flex items-center gap-1 text-primary dark:text-primary-light font-medium text-sm cursor-pointer"
              whileHover={{ x: 4 }}
            >
              {t('details_btn', 'Детайли')}
              <ArrowRight className="w-4 h-4" />
            </motion.span>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function UpcomingEvents() {
  const [mounted, setMounted] = useState(false)
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const { t } = useDictionary('events')

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('status', 'published')
          .gte('start_date', new Date().toISOString())
          .order('start_date', { ascending: true })
          .limit(3)

        if (error) throw error
        setEvents(data && data.length > 0 ? data : fallbackEvents)
      } catch (error: any) {
        // Ignore AbortError - it's normal when component unmounts
        if (error?.name === 'AbortError' || error?.message?.includes('aborted')) {
          return
        }
        console.error('Error fetching events:', error)
        setEvents(fallbackEvents)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [mounted])

  return (
    <section id="events" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-900">
      <div className="container mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-light mb-6 shadow-xl shadow-primary/30"
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
          >
            <CalendarDays className="w-10 h-10 text-white" />
          </motion.div>
          
          <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl mb-4 text-gray-900 dark:text-white">
            {t('title', 'Предстоящи')}{' '}
            <span className="text-gradient">{t('title_highlight', 'Събития')}</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('subtitle', 'Не пропускайте нашите вълнуващи събития и инициативи')}
          </p>
        </motion.div>

        {/* Events Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <motion.div
              className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {mounted && events.map((event, index) => (
              <EventCard 
                key={event.id} 
                event={event} 
                index={index}
                isFeatured={event.featured || index === 0}
              />
            ))}
          </div>
        )}

        {/* View All Link */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <Link href="/events">
            <motion.span
              className="inline-flex items-center gap-2 px-8 py-4 btn-glow text-white rounded-full font-semibold cursor-pointer relative overflow-hidden group"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Calendar className="w-5 h-5 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
              </motion.div>
              {t('view_all_btn', 'Виж всички събития')}
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ExternalLink className="w-4 h-4" />
              </motion.div>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full"
                transition={{ duration: 0.6 }}
              />
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
