'use client'

import { usePathname } from 'next/navigation'
import { Header } from './Header'
import { Footer } from './Footer'
import { ScrollProgress } from '@/components/ui/ScrollProgress'
import { ScrollToTop } from '@/components/ui/ScrollToTop'
import { AccessibilityMenu } from '@/components/ui/AccessibilityMenu'

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')

  return (
    <>
      {!isAdminRoute && (
        <>
          <ScrollProgress />
          <Header />
          <AccessibilityMenu isMobile={false} />
        </>
      )}
      <main className={isAdminRoute ? '' : 'min-h-screen overflow-x-hidden'}>
        {children}
      </main>
      {!isAdminRoute && (
        <>
          <Footer />
          <ScrollToTop />
        </>
      )}
    </>
  )
}
