'use client'

import { ThemeProvider } from './ThemeProvider'
import { LanguageProvider } from '@/lib/contexts/LanguageContext'
import { AccessibilityProvider } from '@/lib/contexts/AccessibilityContext'
import { SupabaseProvider } from './SupabaseProvider'
import { ErrorBoundary } from './ErrorBoundary'

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SupabaseProvider>
          <LanguageProvider>
            <AccessibilityProvider>
              {children}
            </AccessibilityProvider>
          </LanguageProvider>
        </SupabaseProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
