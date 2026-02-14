'use client'

import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { Users, Calendar, Trophy, Heart } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface StatItemProps {
  value: number
  suffix?: string
  label: string
  icon: any
  delay?: number
}

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  useEffect(() => {
    if (isInView) {
      motionValue.set(value)
    }
  }, [isInView, value, motionValue])

  useEffect(() => {
    return springValue.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.round(latest) + suffix
      }
    })
  }, [springValue, suffix])

  return <span ref={ref}>0{suffix}</span>
}

function StatItem({ value, suffix = '', label, icon: Icon, delay = 0 }: StatItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay }}
      className="group relative"
    >
      <motion.div
        className="apple-glass relative p-6 overflow-hidden"
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {/* Icon */}
        <div className="relative mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/10 dark:bg-white dark:text-slate-900">
          <Icon className="h-6 w-6" />
        </div>

        {/* Value */}
        <div className="relative">
          <span className="block text-4xl sm:text-5xl font-semibold tracking-tight text-slate-900 dark:text-white mb-1">
            <AnimatedNumber value={value} suffix={suffix} />
          </span>
          <span className="text-slate-600 dark:text-slate-300 font-medium">
            {label}
          </span>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function StatsSection() {
  const [stats, setStats] = useState([
    { value: 0, suffix: '+', label: 'Активни членове', icon: Users },
    { value: 0, suffix: '+', label: 'Събития годишно', icon: Calendar },
    { value: 0, suffix: '+', label: 'Години история', icon: Trophy },
    { value: 0, suffix: '+', label: 'Текущи проекти', icon: Heart },
  ])

  useEffect(() => {
    const supabase = createClient()

    const load = async () => {
      try {
        const currentYear = new Date().getFullYear()
        const startOfYear = new Date(currentYear, 0, 1).toISOString()
        const endOfYear = new Date(currentYear + 1, 0, 1).toISOString()

        const [
          teamRes,
          eventsYearRes,
          eventsAllRes,
        ] = await Promise.all([
          supabase.from('team_members').select('id', { count: 'exact', head: true }).eq('visible', true),
          supabase
            .from('events')
            .select('id,start_date', { count: 'exact', head: true })
            .eq('status', 'published')
            .gte('start_date', startOfYear)
            .lt('start_date', endOfYear),
          supabase
            .from('events')
            .select('start_date', { head: false })
            .eq('status', 'published')
            .order('start_date', { ascending: true }),
        ])

        const membersCount = teamRes.count ?? 0
        const eventsYearCount = eventsYearRes.count ?? 0

        let yearsHistory = 0
        if (eventsAllRes.data && eventsAllRes.data.length > 0) {
          const first = new Date(eventsAllRes.data[0].start_date as string)
          yearsHistory = Math.max(1, currentYear - first.getFullYear() + 1)
        }

        const upcomingRes = await supabase
          .from('events')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'published')
          .gte('start_date', new Date().toISOString())

        const upcomingCount = upcomingRes.count ?? 0

        setStats([
          { value: membersCount || 0, suffix: '+', label: 'Активни членове', icon: Users },
          { value: eventsYearCount || 0, suffix: '+', label: 'Събития годишно', icon: Calendar },
          { value: yearsHistory || 1, suffix: '+', label: 'Години история', icon: Trophy },
          { value: upcomingCount || 0, suffix: '+', label: 'Текущи проекти', icon: Heart },
        ])
      } catch (error) {
        console.error('Error loading stats:', error)
      }
    }

    load()
  }, [])

  return (
    <section className="relative overflow-hidden py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#0b0d12]">
      <div className="absolute inset-0 bg-apple-grid opacity-30" />
      <div className="absolute inset-0 bg-noise opacity-[0.03] dark:opacity-[0.04]" />
      <div className="container mx-auto relative z-10">
        {/* Section intro */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.21, 0.61, 0.35, 1] }}
          className="mb-10 text-center"
        >
          <div className="mx-auto inline-flex items-center gap-2 rounded-full px-4 py-2 apple-glass">
            <span className="text-xs font-semibold tracking-wide text-slate-700 dark:text-slate-200">
              В числа
            </span>
          </div>
          <h2 className="mt-5 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Малко цифри. Ясна картина.
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Кратък поглед към това какво правим и колко хора стоят зад него.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => (
            <StatItem
              key={stat.label}
              {...stat}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
