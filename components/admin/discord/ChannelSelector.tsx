'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Hash, ChevronDown, Check } from 'lucide-react'

interface ChannelSelectorProps {
  channels: Array<{
    id: string
    name: string
    type: number
  }>
  selectedChannel: string
  onChannelChange: (channelId: string) => void
}

export function ChannelSelector({ channels, selectedChannel, onChannelChange }: ChannelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedChannelData = channels.find(c => c.id === selectedChannel)
  const textChannels = channels.filter(c => c.type === 0) // Text channels

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Целеви Канал
        </h3>
        <Hash className="w-5 h-5 text-gray-400" />
      </div>

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <Hash className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 dark:text-white">
              {selectedChannelData ? selectedChannelData.name : 'Избери канал'}
            </span>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full mt-2 left-0 right-0 z-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto"
              >
                {textChannels.length > 0 ? (
                  textChannels.map((channel) => (
                    <button
                      key={channel.id}
                      onClick={() => {
                        onChannelChange(channel.id)
                        setIsOpen(false)
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-between ${
                        selectedChannel === channel.id
                          ? 'bg-primary/10 text-primary dark:text-primary-light'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Hash className="w-4 h-4" />
                        <span>{channel.name}</span>
                      </div>
                      {selectedChannel === channel.id && (
                        <Check className="w-4 h-4" />
                      )}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                    Няма налични канали
                  </div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {selectedChannelData && (
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          Съобщенията ще се изпращат в #{selectedChannelData.name}
        </p>
      )}
    </motion.div>
  )
}
