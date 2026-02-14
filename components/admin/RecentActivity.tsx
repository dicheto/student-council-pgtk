'use client'

import { motion } from 'framer-motion'
import { Clock, User, FileText, Calendar } from 'lucide-react'

const activities = [
  {
    id: 1,
    type: 'news',
    title: 'Нова статия публикувана',
    user: 'Иван Петров',
    time: 'преди 5 минути',
    icon: FileText,
    color: 'bg-blue-500',
  },
  {
    id: 2,
    type: 'event',
    title: 'Събитие създадено',
    user: 'Мария Георгиева',
    time: 'преди 1 час',
    icon: Calendar,
    color: 'bg-green-500',
  },
  {
    id: 3,
    type: 'user',
    title: 'Нов потребител регистриран',
    user: 'Система',
    time: 'преди 2 часа',
    icon: User,
    color: 'bg-purple-500',
  },
  {
    id: 4,
    type: 'news',
    title: 'Статия редактирана',
    user: 'Иван Петров',
    time: 'преди 3 часа',
    icon: FileText,
    color: 'bg-blue-500',
  },
]

export function RecentActivity() {
  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Последна Активност
      </h3>
      
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = activity.icon
          return (
            <motion.div
              key={activity.id}
              className="flex items-start space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className={`${activity.color} p-2 rounded-lg`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {activity.title}
                </p>
                <div className="mt-1 flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>{activity.user}</span>
                  <span>•</span>
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{activity.time}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
