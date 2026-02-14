'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Locale = 'bg' | 'en'

interface LanguageContextType {
  language: Locale
  setLanguage: (lang: Locale) => void
  toggleLanguage: () => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Locale>('bg')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load language from localStorage
    try {
      const savedLanguage = localStorage.getItem('language') as Locale | null
      if (savedLanguage && (savedLanguage === 'bg' || savedLanguage === 'en')) {
        setLanguageState(savedLanguage)
      }
    } catch (error) {
      // localStorage might not be available (SSR)
      console.warn('Could not access localStorage:', error)
    }
  }, [])

  const setLanguage = (lang: Locale) => {
    setLanguageState(lang)
    try {
      localStorage.setItem('language', lang)
      // Trigger a custom event to notify other components
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }))
      }
    } catch (error) {
      // localStorage might not be available
      console.warn('Could not save to localStorage:', error)
    }
  }

  const toggleLanguage = () => {
    const newLang = language === 'bg' ? 'en' : 'bg'
    setLanguage(newLang)
  }

  // Always provide the context, even before mounted
  // This ensures useLanguage works everywhere
  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
