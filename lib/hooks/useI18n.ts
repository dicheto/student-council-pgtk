'use client'

import { useMemo } from 'react'
import { useLanguage } from '@/lib/contexts/LanguageContext'
import bgMessages from '@/messages/bg.json'
import enMessages from '@/messages/en.json'

type Messages = typeof bgMessages
type MessageKey = string

function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((current, key) => current?.[key], obj) || path
}

export function useI18n() {
  const { language } = useLanguage()

  const messages: Messages = useMemo(() => {
    return language === 'en' ? enMessages : bgMessages
  }, [language])

  const t = useMemo(
    () => (key: MessageKey, defaultValue?: string): string => {
      const value = getNestedValue(messages, key)
      return value !== key ? value : (defaultValue || key)
    },
    [messages]
  )

  return { t, language, messages }
}
