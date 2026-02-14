'use client'

import { motion } from 'framer-motion'
import { Bot, Wifi, WifiOff, Clock, AlertCircle } from 'lucide-react'

interface BotStatusProps {
  status: 'online' | 'offline' | 'idle' | 'dnd'
}

const statusConfig = {
  online: {
    label: 'Онлайн',
    color: 'bg-green-500',
    icon: Wifi,
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    textColor: 'text-green-700 dark:text-green-400',
  },
  offline: {
    label: 'Офлайн',
    color: 'bg-gray-500',
    icon: WifiOff,
    bgColor: 'bg-gray-50 dark:bg-gray-800',
    textColor: 'text-gray-700 dark:text-gray-400',
  },
  idle: {
    label: 'Неактивен',
    color: 'bg-yellow-500',
    icon: Clock,
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    textColor: 'text-yellow-700 dark:text-yellow-400',
  },
  dnd: {
    label: 'Не безпокои',
    color: 'bg-red-500',
    icon: AlertCircle,
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    textColor: 'text-red-700 dark:text-red-400',
  },
}

export function BotStatus({ status }: BotStatusProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Статус на Bot
        </h3>
        <Bot className="w-5 h-5 text-gray-400" />
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className={`relative ${config.color} w-3 h-3 rounded-full`}>
            <motion.div
              className={`absolute inset-0 ${config.color} rounded-full`}
              animate={{
                scale: [1, 1.5, 1],
                opacity: status === 'online' ? [0.5, 0, 0.5] : 0.5,
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>
          <span className={`font-medium ${config.textColor}`}>
            {config.label}
          </span>
        </div>

        <div className={`${config.bgColor} rounded-lg p-4`}>
          <div className="flex items-center space-x-2">
            <Icon className={`w-5 h-5 ${config.textColor}`} />
            <div>
              <p className={`text-sm font-medium ${config.textColor}`}>
                {status === 'online' 
                  ? 'Bot е активен и готов за работа'
                  : status === 'offline'
                  ? 'Bot не е свързан'
                  : status === 'idle'
                  ? 'Bot е неактивен'
                  : 'Bot е в режим "Не безпокои"'}
              </p>
              {status === 'online' && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Последна активност: преди малко
                </p>
              )}
            </div>
          </div>
        </div>

        {status === 'offline' && (
          <motion.button
            className="w-full px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={async () => {
              const response = await fetch('/api/discord/connect', {
                method: 'POST',
              })
              if (response.ok) {
                window.location.reload()
              }
            }}
          >
            Свържи Bot
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
