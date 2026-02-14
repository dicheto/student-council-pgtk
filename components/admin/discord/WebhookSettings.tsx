'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Webhook, Check, X, TestTube } from 'lucide-react'

interface WebhookSettingsProps {
  webhookUrl: string
  onWebhookChange: (url: string) => void
}

export function WebhookSettings({ webhookUrl, onWebhookChange }: WebhookSettingsProps) {
  const [inputUrl, setInputUrl] = useState(webhookUrl)
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null)

  const handleSave = async () => {
    try {
      const response = await fetch('/api/discord/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhookUrl: inputUrl }),
      })

      if (response.ok) {
        onWebhookChange(inputUrl)
        setTestResult('success')
        setTimeout(() => setTestResult(null), 3000)
      }
    } catch (error) {
      console.error('Error saving webhook:', error)
      setTestResult('error')
    }
  }

  const handleTest = async () => {
    if (!inputUrl.trim()) {
      alert('Моля, въведете webhook URL')
      return
    }

    setIsTesting(true)
    setTestResult(null)

    try {
      const response = await fetch('/api/discord/test-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhook: inputUrl }),
      })

      if (response.ok) {
        setTestResult('success')
      } else {
        setTestResult('error')
      }
    } catch (error) {
      setTestResult('error')
    } finally {
      setIsTesting(false)
      setTimeout(() => setTestResult(null), 3000)
    }
  }

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Webhook Настройки
        </h3>
        <Webhook className="w-5 h-5 text-gray-400" />
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Webhook URL
          </label>
          <input
            type="url"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="https://discord.com/api/webhooks/..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Webhook URL за изпращане на съобщения в Discord
          </p>
        </div>

        <div className="flex space-x-2">
          <motion.button
            onClick={handleTest}
            disabled={isTesting || !inputUrl.trim()}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <TestTube className="w-4 h-4" />
            <span>{isTesting ? 'Тестване...' : 'Тест'}</span>
          </motion.button>

          <motion.button
            onClick={handleSave}
            disabled={inputUrl === webhookUrl}
            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Запази
          </motion.button>
        </div>

        {testResult && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center space-x-2 p-3 rounded-lg ${
              testResult === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
            }`}
          >
            {testResult === 'success' ? (
              <>
                <Check className="w-4 h-4" />
                <span className="text-sm">Webhook работи правилно!</span>
              </>
            ) : (
              <>
                <X className="w-4 h-4" />
                <span className="text-sm">Грешка при тестване на webhook</span>
              </>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
