'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface AccessibilityContextType {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  toggleOpen: () => void
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleOpen = () => setIsOpen(prev => !prev)

  return (
    <AccessibilityContext.Provider value={{ isOpen, setIsOpen, toggleOpen }}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibilityMenu() {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error('useAccessibilityMenu must be used within AccessibilityProvider')
  }
  return context
}
