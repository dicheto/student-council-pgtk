'use client'

import { useState, useEffect, useMemo } from 'react'
import { useLanguage } from '@/lib/contexts/LanguageContext'

interface DictionaryEntry {
  id: string
  key: string
  category: string
  value_en: string
  value_bg: string
  description: string
  is_html: boolean
}

interface UseDictionaryReturn {
  t: (key: string, defaultValue?: string) => string
  entries: Record<string, DictionaryEntry>
  loading: boolean
  error: string | null
}

export function useDictionary(category?: string): UseDictionaryReturn {
  const { language } = useLanguage()
  const [entries, setEntries] = useState<Record<string, DictionaryEntry>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    
    const fetchDictionary = async () => {
      try {
        setLoading(true)
        const query = new URLSearchParams()
        if (category) {
          query.append('category', category)
        }

        const response = await fetch(`/api/dictionary?${query.toString()}`, {
          signal: controller.signal,
        })
        if (!response.ok) {
          throw new Error('Failed to fetch dictionary')
        }

        const data: DictionaryEntry[] = await response.json()
        const entriesMap: Record<string, DictionaryEntry> = {}

        data.forEach((entry) => {
          entriesMap[entry.key] = entry
        })

        setEntries(entriesMap)
        setError(null)
      } catch (err) {
        // Don't report error if request was aborted (component unmounted)
        if (err instanceof Error && err.name === 'AbortError') {
          return
        }
        console.error('Error fetching dictionary:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchDictionary()
    
    return () => controller.abort()
  }, [category])

  const t = useMemo(
    () => (key: string, defaultValue: string = key) => {
      const entry = entries[key]
      if (!entry) {
        return defaultValue
      }

      const value = language === 'en' ? entry.value_en : entry.value_bg
      return value || defaultValue
    },
    [entries, language]
  )

  return { t, entries, loading, error }
}

// Hook to get a single key with fallback
export function useTranslation(key: string, defaultValue?: string): string {
  const { language } = useLanguage()
  const [value, setValue] = useState<string>(defaultValue || key)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    
    const fetchTranslation = async () => {
      try {
        const response = await fetch(`/api/dictionary?key=${key}`, {
          signal: controller.signal,
        })
        if (!response.ok) {
          setValue(defaultValue || key)
          return
        }

        const data: DictionaryEntry[] = await response.json()
        if (data.length > 0) {
          const entry = data[0]
          const translated = language === 'en' ? entry.value_en : entry.value_bg
          setValue(translated || defaultValue || key)
        }
      } catch (err) {
        // Don't report error if request was aborted (component unmounted)
        if (err instanceof Error && err.name === 'AbortError') {
          return
        }
        console.error('Error fetching translation:', err)
        setValue(defaultValue || key)
      } finally {
        setLoading(false)
      }
    }

    fetchTranslation()
    
    return () => controller.abort()
  }, [key, language, defaultValue])

  return value
}
