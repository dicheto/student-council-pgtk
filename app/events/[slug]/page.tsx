'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/contexts/LanguageContext'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, ArrowLeft, Share2, MapPin, Clock, ExternalLink } from 'lucide-react'
import { format } from 'date-fns'
import { bg } from 'date-fns/locale'
import { AddToCalendarButtons } from '@/components/events/AddToCalendarButtons'

type LocalizedText = string | { bg?: string; en?: string } | null

interface EventDetailRow {
  id: string
  title: LocalizedText
  slug: string
  description: LocalizedText
  start_date: string
  end_date: string | null
  location: string | null
  location_url: string | null
  image_url: string | null
  status: string
  featured: boolean
  created_at: string
  updated_at: string
}

interface EventDetail {
  id: string
  title: string
  slug: string
  description: string
  startDate: Date
  endDate: Date | null
  location: string | null
  locationUrl: string | null
  imageUrl: string | null
  created_at: string
  updated_at: string
}

function pickLocale(value: LocalizedText, locale: 'bg' | 'en') {
  if (!value) return ''
  if (typeof value === 'string') return value
  return value?.[locale] || value?.bg || value?.en || ''
}

export default function EventDetailPage({ params }: { params: { slug: string } }) {
  const [event, setEvent] = useState<EventDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const supabase = createClient()
  const { language } = useLanguage()
  const locale = language

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        // Първо опитай да заредиш събитието само по slug
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('slug', params.slug)
          .maybeSingle()

        if (error) {
          console.error('Supabase error:', error)
          setError(true)
          return
        }

        if (!data) {
          console.log('No event found with slug:', params.slug)
          setError(true)
          return
        }

        const row = data as any
        
        // Проверка дали събитието е публикувано
        // Поддържаме и двата варианта: status = 'published' или is_published = true
        const isPublished = row.status === 'published' || row.is_published === true
        
        if (!isPublished) {
          console.log('Event is not published:', { status: row.status, is_published: row.is_published })
          setError(true)
          return
        }

        const startDate = new Date(row.start_date)
        const endDate = row.end_date ? new Date(row.end_date) : null

        setEvent({
          id: row.id,
          title: pickLocale(row.title, locale),
          slug: row.slug,
          description: pickLocale(row.description, locale),
          startDate,
          endDate,
          location: row.location,
          locationUrl: row.location_url,
          imageUrl: row.image_url,
          created_at: row.created_at,
          updated_at: row.updated_at,
        })
      } catch (err) {
        console.error('Error fetching event:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [params.slug, supabase])

  const handleShare = async () => {
    if (navigator.share && event) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.href,
        })
      } catch (err) {
        // User cancelled or error occurred
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Линкът е копиран в клипборда!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0b0d12]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="relative min-h-screen bg-white dark:bg-[#0b0d12] overflow-hidden">
        <div className="absolute inset-0 bg-apple-grid opacity-40" />
        <div className="absolute inset-0 bg-noise opacity-[0.03] dark:opacity-[0.04]" />
        
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4 pt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-xl border border-white/20 dark:border-white/10">
              <Calendar className="h-10 w-10 text-primary dark:text-primary-light" />
            </div>
            
            <h1 className="mb-3 text-3xl font-bold text-slate-900 dark:text-white">
              Събитието не е намерено
            </h1>
            <p className="mb-8 text-slate-600 dark:text-slate-300 max-w-md mx-auto">
              Търсеното събитие не съществува или не е публикувано.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/events"
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 dark:bg-white dark:text-slate-900"
              >
                <ArrowLeft className="h-4 w-4" />
                Назад към събитията
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/50 px-6 py-3 text-sm font-semibold text-slate-900 backdrop-blur-sm transition-all hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
              >
                Начална страница
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-white dark:bg-[#0b0d12] pt-24 pb-20">
      <div className="pointer-events-none absolute inset-0 bg-apple-grid opacity-30" />
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-[0.03] dark:opacity-[0.04]" />

      {/* Header with Featured Image */}
      {event.imageUrl && (
        <div className="relative z-0 mb-10 h-72 overflow-hidden rounded-none sm:h-80 lg:h-96">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
        </div>
      )}

      {/* Event Content */}
      <article className="container relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.21, 0.61, 0.35, 1] }}
        >
          {/* Back Link */}
          <Link
            href="/events"
            className="mb-6 inline-flex items-center text-sm font-semibold text-primary hover:text-primary-dark dark:hover:text-primary-light"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Назад към събитията
          </Link>

          {/* Title */}
          <h1 className="mb-6 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
            {event.title}
          </h1>

          {/* Event Details Card */}
          <div className="mb-8 rounded-2xl apple-glass p-6 sm:p-8">
            <div className="space-y-4">
              {/* Date & Time */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 rounded-xl bg-primary/10 p-3 dark:bg-primary/20">
                  <Calendar className="h-5 w-5 text-primary dark:text-primary-light" />
                </div>
                <div className="flex-1">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Дата и час
                  </p>
                  <p className="text-base font-semibold text-slate-900 dark:text-white">
                    {format(event.startDate, 'EEEE, d MMMM yyyy', { locale: bg })}
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <Clock className="h-4 w-4" />
                    {format(event.startDate, 'HH:mm', { locale: bg })}
                    {event.endDate && ` - ${format(event.endDate, 'HH:mm', { locale: bg })}`}
                  </p>
                </div>
              </div>

              {/* Location */}
              {event.location && (
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 rounded-xl bg-primary/10 p-3 dark:bg-primary/20">
                    <MapPin className="h-5 w-5 text-primary dark:text-primary-light" />
                  </div>
                  <div className="flex-1">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Място
                    </p>
                    {event.locationUrl ? (
                      <a
                        href={event.locationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 text-base font-semibold text-primary hover:text-primary-dark dark:text-primary-light"
                      >
                        {event.location}
                        <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </a>
                    ) : (
                      <p className="text-base font-semibold text-slate-900 dark:text-white">
                        {event.location}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <div className="prose max-w-none text-slate-800 dark:prose-invert dark:text-slate-100">
              <div className="whitespace-pre-line text-base leading-relaxed sm:text-lg">
                {event.description}
              </div>
            </div>
          </div>

          {/* Share Button */}
          <div className="mb-8 flex items-center justify-between border-b border-black/5 pb-4 text-xs text-slate-500 dark:border-white/10 dark:text-slate-300">
            <div className="flex items-center gap-4">
              <div className="inline-flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  Създадено:{' '}
                  {format(new Date(event.created_at), 'd MMMM yyyy', { locale: bg })}
                </span>
              </div>
            </div>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1 text-primary hover:text-primary-dark dark:hover:text-primary-light"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Сподели</span>
            </button>
          </div>

          {/* Add to Calendar */}
          <div className="mb-10 rounded-2xl apple-glass p-6 sm:p-8">
            <AddToCalendarButtons
              event={{
                id: parseInt(event.id.slice(0, 8), 16) || 0,
                title: event.title,
                description: event.description,
                startDate: event.startDate,
                endDate: event.endDate || new Date(event.startDate.getTime() + 3600000),
                location: event.location || '',
                category: 'other',
              }}
            />
          </div>

          {/* Related Events */}
          <div className="rounded-2xl apple-glass px-6 py-5">
            <h3 className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">
              Още събития
            </h3>
            <Link
              href="/events"
              className="text-sm font-semibold text-primary hover:text-primary-dark dark:hover:text-primary-light"
            >
              Преглед на всички събития →
            </Link>
          </div>
        </motion.div>
      </article>
    </div>
  )
}
