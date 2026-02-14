'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface BentoGridProps {
  children: ReactNode
  className?: string
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6', className)}>
      {children}
    </div>
  )
}

interface BentoCardProps {
  children: ReactNode
  className?: string
  span?: 1 | 2 | 3
  delay?: number
}

export function BentoCard({ children, className, span = 1, delay = 0 }: BentoCardProps) {
  const spanClasses = {
    1: 'md:col-span-1',
    2: 'md:col-span-2',
    3: 'md:col-span-3',
  }

  return (
    <motion.div
      className={cn(
        'group relative overflow-hidden rounded-2xl glass-effect p-6',
        'hover:shadow-2xl transition-all duration-300',
        spanClasses[span],
        className
      )}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -8, scale: 1.02 }}
    >
      {/* Hover Gradient Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary-light/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Shine Effect */}
      <motion.div
        className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />
    </motion.div>
  )
}
