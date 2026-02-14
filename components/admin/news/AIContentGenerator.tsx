'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Loader2, ChevronDown } from 'lucide-react'

interface AIContentGeneratorProps {
  existingTitle?: string
  onContentGenerated: (content: string) => void
}

interface Model {
  id: string
  name: string
  provider: string
}

export function AIContentGenerator({ existingTitle, onContentGenerated }: AIContentGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [models, setModels] = useState<Model[]>([])
  const [selectedModel, setSelectedModel] = useState<string>('')
  const [showModelSelect, setShowModelSelect] = useState(false)

  useEffect(() => {
    // Зареждане на наличните модели
    fetch('/api/ai/models')
      .then(res => res.json())
      .then(data => {
        setModels(data.models || [])
        if (data.models && data.models.length > 0) {
          setSelectedModel(data.models[0].id)
        }
      })
      .catch(err => console.error('Error loading models:', err))
  }, [])

  const generateContent = async () => {
    if (!existingTitle || !existingTitle.trim()) {
      alert('Моля, въведете заглавие първо')
      return
    }

    setIsGenerating(true)

    try {
      const response = await fetch('/api/ai/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          title: existingTitle,
          model: selectedModel || undefined
        }),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(error.error || 'Грешка при генериране на съдържание')
      }

      const data = await response.json()
      onContentGenerated(data.content)
    } catch (error: any) {
      console.error('Error generating content:', error)
      alert(error.message || 'Грешка при генериране на съдържание. Моля, опитайте отново.')
    } finally {
      setIsGenerating(false)
    }
  }

  const selectedModelName = models.find(m => m.id === selectedModel)?.name || 'AI Model'

  return (
    <div className="flex items-center space-x-2">
      {/* Model Selector */}
      {models.length > 1 && (
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowModelSelect(!showModelSelect)}
            className="flex items-center space-x-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="text-xs text-gray-600 dark:text-gray-400 max-w-[100px] truncate">
              {selectedModelName}
            </span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>
          
          <AnimatePresence>
            {showModelSelect && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowModelSelect(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full mt-2 left-0 z-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg min-w-[200px]"
                >
                  {models.map((model) => (
                    <button
                      key={model.id}
                      type="button"
                      onClick={() => {
                        setSelectedModel(model.id)
                        setShowModelSelect(false)
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                        selectedModel === model.id
                          ? 'bg-primary/10 text-primary dark:text-primary-light'
                          : 'text-gray-700 dark:text-gray-300'
                      } ${model.id === models[0].id ? 'rounded-t-lg' : ''} ${
                        model.id === models[models.length - 1].id ? 'rounded-b-lg' : ''
                      }`}
                    >
                      <div className="font-medium">{model.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {model.provider}
                      </div>
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Generate Button */}
      <motion.button
        type="button"
        onClick={generateContent}
        disabled={isGenerating || !existingTitle || !existingTitle.trim()}
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
  )
}
