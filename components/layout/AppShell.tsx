'use client'

import { Header } from './Header'
import { Footer } from './Footer'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}
