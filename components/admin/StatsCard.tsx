'use client'

import { motion } from 'framer-motion'
import { LucideIcon, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: LucideIcon
  color: string
}

export function StatsCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  color,
}: StatsCardProps) {
  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      whileHover={{ y: -4, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          <div className="mt-2 flex items-center">
            <TrendingUp
              className={cn(
                'w-4 h-4 mr-1',
                trend === 'up' ? 'text-green-500' : 'text-red-500'
              )}
            />
            <span
              className={cn(
                'text-sm font-medium',
                trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              )}
            >
              {change}
            </span>
            <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
              от миналия месец
            </span>
          </div>
        </div>
        <div className={cn('p-3 rounded-lg', color)}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  )
}
