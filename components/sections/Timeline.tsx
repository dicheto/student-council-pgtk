'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { 
  Calendar, Trophy, Sparkles, Users, 
  PartyPopper, GraduationCap, Heart,
  Star, Zap, Flag
} from 'lucide-react'
import { useLanguage } from '@/lib/contexts/LanguageContext'

interface TimelineEvent {
  id: string
  year: string
  month: string
  title: string
  description: string
  icon: any
  color: string
  highlight?: boolean
}

const iconMapping: Record<string, any> = {
  Calendar,
  GraduationCap,
  PartyPopper,
  Heart,
  Sparkles,
  Trophy,
  Star,
  Flag,
  Users,
  Zap,
}

function TimelineItem({ event, index, isLast }: { event: TimelineEvent; index: number; isLast: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
  })
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0.3, 1])
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1])
  const x = useTransform(
    scrollYProgress, 
    [0, 0.5], 
    [index % 2 === 0 ? -50 : 50, 0]
  )

  const Icon = event.icon

  return (
    <motion.div
      ref={ref}
      className={`flex items-stretch gap-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
      style={{ opacity }}
    >
      {/* Content Card */}
      <motion.div
        className={`flex-1 flex ${index % 2 === 0 ? 'justify-end' : 'justify-start'} items-center`}
        style={{ x, scale }}
      >
        <motion.div
          className={`inline-block p-6 rounded-2xl ${
            event.highlight 
              ? 'bg-gradient-to-br from-primary/10 to-primary-light/10 border-2 border-primary/30 shadow-lg shadow-primary/10' 
              : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700'
          }`}
          whileHover={{ scale: 1.02, y: -4 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {/* Date badge */}
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${event.color} text-white text-xs font-bold mb-3`}>
            <Calendar className="w-3 h-3" />
            {event.month} {event.year}
          </div>
          
          <h3 className={`font-display font-bold text-xl text-gray-900 dark:text-white mb-2 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
            {event.title}
          </h3>
          <p className={`text-gray-600 dark:text-gray-400 text-sm max-w-sm ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
            {event.description}
          </p>

          {event.highlight && (
            <motion.div 
              className={`mt-3 inline-flex items-center gap-1 text-primary dark:text-primary-light text-sm font-medium ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Zap className="w-4 h-4" />
              Не пропускайте!
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* Timeline Center - Now properly centered */}
      <div className="flex flex-col items-center relative py-6">
        {/* Icon Circle */}
        <motion.div
          className={`relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br ${event.color} flex items-center justify-center shadow-lg flex-shrink-0`}
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6 }}
        >
          <Icon className="w-8 h-8 text-white" />
          
          {/* Pulse ring for highlighted events */}
          {event.highlight && (
            <motion.div
              className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${event.color} opacity-50`}
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.div>
        
        {/* Connecting Line - Now centered and flexible height */}
        {!isLast && (
          <motion.div 
            className="w-1 flex-grow bg-gradient-to-b from-gray-300 to-gray-200 dark:from-slate-600 dark:to-slate-700 rounded-full mt-6 mb-6 min-h-[80px]"
            initial={{ scaleY: 0, originY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        )}
      </div>

      {/* Spacer for alternating layout */}
      <div className="flex-1" />
    </motion.div>
  )
}

export function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([])
  const [loading, setLoading] = useState(true)
  const { language } = useLanguage()

  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        const response = await fetch('/api/milestones')
        const data = await response.json()
        
        const mappedEvents: TimelineEvent[] = data.map((milestone: any) => ({
          id: milestone.id,
          year: milestone.year,
          month: milestone.month,
          title: milestone.title?.[language] || milestone.title?.bg || '',
          description: milestone.description?.[language] || milestone.description?.bg || '',
          icon: iconMapping[milestone.icon] || Calendar,
          color: milestone.color,
          highlight: milestone.is_highlighted,
        }))
        
        setTimelineEvents(mappedEvents)
      } catch (error) {
        console.error('Error fetching milestones:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMilestones()
  }, [language])

  if (loading) {
    return (
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-900">
        <div className="container mx-auto flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </section>
    )
  }

  if (timelineEvents.length === 0) {
    return (
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-900">
        <div className="container mx-auto text-center">
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Няма налични събития в календара.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section 
      ref={containerRef}
      className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-900 overflow-hidden"
    >
      <div className="container mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-accent to-accent-light mb-6 shadow-xl shadow-accent/30"
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
          >
            <Calendar className="w-10 h-10 text-white" />
          </motion.div>
          
          <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl mb-4 text-gray-900 dark:text-white">
            Календар{' '}
            <span className="bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
              2024/2025
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Основни събития и инициативи през учебната година
          </p>
        </motion.div>

        {/* Timeline - Desktop */}
        <div className="hidden md:block max-w-4xl mx-auto space-y-8">
          {timelineEvents.map((event, index) => (
            <TimelineItem 
              key={event.id} 
              event={event} 
              index={index}
              isLast={index === timelineEvents.length - 1}
            />
          ))}
        </div>

        {/* Timeline - Mobile */}
        <div className="md:hidden space-y-6">
          {timelineEvents.map((event, index) => {
            const Icon = event.icon
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`p-5 rounded-2xl ${
                  event.highlight 
                    ? 'bg-gradient-to-br from-primary/10 to-primary-light/10 border-2 border-primary/30' 
                    : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${event.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                        {event.month} {event.year}
                      </span>
                      {event.highlight && (
                        <span className="px-2 py-0.5 rounded-full bg-accent/20 text-accent-dark dark:text-accent-light text-xs font-bold">
                          Важно
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {event.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
