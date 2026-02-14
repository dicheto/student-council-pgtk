'use client'

import { ReactNode } from 'react'

// Independent layout for file manager - works even if main app breaks
export default function FileManagerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900">
      {children}
    </div>
  )
}
