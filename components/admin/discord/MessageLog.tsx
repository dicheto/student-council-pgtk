'use client'

import { motion } from 'framer-motion'
import { MessageSquare, CheckCircle, XCircle, Clock } from 'lucide-react'
import { format } from 'date-fns'

interface Message {
  id: string
  content: string
  channel: string
  timestamp: string | Date
  status: 'success' | 'error'
  type: 'webhook' | 'bot'
}

interface MessageLogProps {
  messages: Message[]
}

export function MessageLog({ messages }: MessageLogProps) {
  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Лог на Съобщения
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Последни изпратени съобщения
          </p>
        </div>
        <MessageSquare className="w-5 h-5 text-gray-400" />
      </div>

      <div className="space-y-3">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {message.status === 'success' ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                      message.type === 'webhook'
                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                        : 'bg-primary/10 text-primary dark:bg-primary/30 dark:text-primary-light'
                    }`}>
                      {message.type === 'webhook' ? 'Webhook' : 'Bot'}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      #{message.channel}
                    </span>
                  </div>
                  <p className="text-sm text-gray-900 dark:text-white mb-2">
                    {message.content}
                  </p>
                  <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{format(new Date(message.timestamp), 'dd MMM yyyy, HH:mm')}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Няма изпратени съобщения</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
