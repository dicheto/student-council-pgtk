'use client'

import { motion } from 'framer-motion'
import { useMemo } from 'react'

export function ChartCard() {
  const data = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => ({
      day: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'][i],
      value: Math.floor(Math.random() * 100) + 20,
    }))
  }, [])

  const maxValue = Math.max(...data.map(d => d.value))

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Прегледи през седмицата
      </h3>
      
      <div className="flex items-end justify-between h-48 space-x-2">
        {data.map((item, index) => (
          <motion.div
            key={item.day}
            className="flex-1 flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="relative w-full h-full flex items-end">
              <motion.div
                className="w-full bg-gradient-to-t from-primary to-primary-light rounded-t-lg"
                initial={{ height: 0 }}
                animate={{ height: `${(item.value / maxValue) * 100}%` }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: 'easeOut' }}
                whileHover={{ opacity: 0.8 }}
              />
            </div>
            <div className="mt-2 text-xs font-medium text-gray-600 dark:text-gray-400">
              {item.day}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500">
              {item.value}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
