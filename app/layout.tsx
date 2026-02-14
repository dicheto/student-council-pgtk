import type { Metadata } from 'next'
import { IBM_Plex_Sans } from 'next/font/google'
import './globals.css'
import { AppProviders } from '@/components/providers/AppProviders'
import { ConditionalLayout } from '@/components/layout/ConditionalLayout'
import Script from 'next/script'

const plexSans = IBM_Plex_Sans({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plex-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Ученически Съвет - ПГТК ""',
    template: '%s | ПГТК ""'
  },
  description: 'Официален уебсайт на Ученическия Съвет на ПГТК "". Вдъхновяваме промяна, изграждаме общност, създаваме бъдеще.',
  keywords: ['ученически съвет', 'ПГТК', 'училище', 'събития', 'новини', ''],
  authors: [{ name: 'Ученически Съвет ПГТК' }],
  openGraph: {
    title: 'Ученически Съвет - ПГТК ""',
    description: 'Вдъхновяваме промяна, изграждаме общност, създаваме бъдеще.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="bg" suppressHydrationWarning className="overflow-x-hidden">
      <head>
        <Script
          id="error-suppression"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Suppress Supabase AbortError in development
              if (typeof window !== 'undefined') {
                window.addEventListener('unhandledrejection', (event) => {
                  if (
                    event.reason?.name === 'AbortError' ||
                    event.reason?.message?.includes('signal is aborted') ||
                    event.reason?.message?.includes('@supabase/auth-js')
                  ) {
                    event.preventDefault();
                  }
                });
                
                const originalError = console.error;
                console.error = (...args) => {
                  const msg = args[0]?.toString?.() || '';
                  if (msg.includes('AbortError') || msg.includes('signal is aborted')) {
                    return;
                  }
                  originalError.apply(console, args);
                };
              }
            `,
          }}
        />
      </head>
      <body className={`${plexSans.variable} font-sans antialiased`}>
        <AppProviders>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </AppProviders>
      </body>
    </html>
  )
}
