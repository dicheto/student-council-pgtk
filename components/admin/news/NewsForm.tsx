'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  FileText, 
  Image as ImageIcon, 
  Settings, 
  Send,
  Sparkles,
  Upload,
  X,
  Check,
  Loader2
} from 'lucide-react'
import { ImageUpload } from '@/components/ui/ImageUpload'

const steps = [
  { id: 1, name: 'Съдържание', icon: FileText },
  { id: 2, name: 'Изображения', icon: ImageIcon },
  { id: 3, name: 'Настройки', icon: Settings },
]

interface NewsFormData {
  title: { bg: string; en: string }
  content: { bg: string; en: string }
  excerpt: { bg: string; en: string }
  images_urls: string[]
  publishToDiscord: boolean
  status: 'draft' | 'published'
}

export function NewsForm({ newsId, onClose }: { newsId?: string; onClose: () => void }) {
  const router = useRouter()
  const locale: 'bg' | 'en' = 'bg' // Admin panel is always in Bulgarian
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState('')
  const contentRef = useRef<HTMLTextAreaElement>(null)

  const [formData, setFormData] = useState<NewsFormData>({
    title: { bg: '', en: '' },
    content: { bg: '', en: '' },
    excerpt: { bg: '', en: '' },
    images_urls: [],
    publishToDiscord: false,
    status: 'draft',
  })

  const updateFormData = (field: keyof NewsFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const generateWithAI = async () => {
    const title = formData.title[locale as 'bg' | 'en'] || formData.title.bg
    if (!title.trim()) {
      alert('Моля, въведете заглавие първо')
      return
    }

    setIsGenerating(true)
    setGeneratedContent('')

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, locale }),
      })

      if (!response.ok) {
        throw new Error('Грешка при генериране на съдържание')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('No response body')
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        setGeneratedContent(prev => {
          const newContent = prev + chunk
          // Update form data in real-time
          const currentContent = { ...formData.content }
          currentContent[locale as 'bg' | 'en'] = newContent
          updateFormData('content', currentContent)
          return newContent
        })
      }
    } catch (error) {
      console.error('Error generating content:', error)
      alert('Грешка при генериране на съдържание. Моля, опитайте отново.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleImagesUpload = (urls: string[]) => {
    updateFormData('images_urls', urls)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const slug = formData.title.bg
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

      const response = await fetch(newsId ? `/api/news/${newsId}` : '/api/news', {
        method: newsId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          slug,
        }),
      })

      if (!response.ok) {
        throw new Error('Грешка при запазване')
      }

      const data = await response.json()

      // Post to Discord if enabled
      if (formData.publishToDiscord && formData.status === 'published') {
        await fetch('/api/discord/post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            newsId: data.id,
            publishToDiscord: true,
          }),
        })
      }

      router.refresh()
      onClose()
    } catch (error) {
      console.error('Error submitting:', error)
      alert('Грешка при публикуване. Моля, опитайте отново.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isActive = currentStep === step.id
          const isCompleted = currentStep > step.id
          
          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <motion.div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
                    isActive
                      ? 'bg-primary border-primary text-white'
                      : isCompleted
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-400'
                  }`}
                  whileHover={{ scale: 1.1 }}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                </motion.div>
                <span
                  className={`mt-2 text-sm font-medium ${
                    isActive
                      ? 'text-primary dark:text-primary-light'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-4 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Form Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Заглавие (БГ) *
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={formData.title.bg}
                    onChange={(e) => updateFormData('title', { ...formData.title, bg: e.target.value })}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Въведете заглавие на статията"
                  />
                  <motion.button
                    type="button"
                    onClick={generateWithAI}
                    disabled={isGenerating || !formData.title.bg.trim()}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                    whileHover={{ scale: isGenerating ? 1 : 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Генериране...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>AI Генератор</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Заглавие (EN)
                </label>
                <input
                  type="text"
                  value={formData.title.en}
                  onChange={(e) => updateFormData('title', { ...formData.title, en: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter article title (English)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Кратко описание (БГ)
                </label>
                <textarea
                  value={formData.excerpt.bg}
                  onChange={(e) => updateFormData('excerpt', { ...formData.excerpt, bg: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Кратко описание на статията..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Съдържание (БГ) *
                </label>
                <textarea
                  ref={contentRef}
                  value={formData.content.bg}
                  onChange={(e) => updateFormData('content', { ...formData.content, bg: e.target.value })}
                  rows={12}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white font-mono text-sm"
                  placeholder="Въведете съдържанието на статията..."
                />
                {isGenerating && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 text-sm text-primary dark:text-primary-light"
                  >
                    Генерира се съдържание...
                  </motion.div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Съдържание (EN)
                </label>
                <textarea
                  value={formData.content.en}
                  onChange={(e) => updateFormData('content', { ...formData.content, en: e.target.value })}
                  rows={12}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white font-mono text-sm"
                  placeholder="Enter article content (English)..."
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <ImageUpload
              images={formData.images_urls}
              onImagesChange={handleImagesUpload}
            />
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Статус
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => updateFormData('status', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="draft">Чернова</option>
                  <option value="published">Публикувана</option>
                </select>
              </div>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.publishToDiscord}
                  onChange={(e) => updateFormData('publishToDiscord', e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Публикувай в Discord (само ако статусът е „Публикувана“)
                </span>
              </label>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Назад
        </button>
        
        {currentStep < steps.length ? (
          <button
            onClick={nextStep}
            className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            Напред
          </button>
        ) : (
          <motion.button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center space-x-2 px-6 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Запазване...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Публикувай</span>
              </>
            )}
          </motion.button>
        )}
      </div>
    </div>
  )
}
