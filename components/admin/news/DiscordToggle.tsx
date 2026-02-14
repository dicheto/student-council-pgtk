'use client'

import { motion } from 'framer-motion'
import { MessageSquare } from 'lucide-react'

interface DiscordToggleProps {
  enabled: boolean
  onToggle: (enabled: boolean) => void
}

export function DiscordToggle({ enabled, onToggle }: DiscordToggleProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-500 rounded-lg">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              Публикуване в Discord
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Изпращане на статията към Discord канал
            </p>
          </div>
        </div>
        
        <motion.button
          onClick={() => onToggle(!enabled)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            enabled ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-gray-600'
          }`}
          whileTap={{ scale: 0.95 }}
        >
          <motion.span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
            layout
          />
        </motion.button>
      </div>

      {enabled && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800"
        >
          <p className="text-sm text-indigo-700 dark:text-indigo-300">
            ✓ Статията ще бъде публикувана в Discord когато я запазиш
          </p>
        </motion.div>
      )}
    </div>
  )
}
