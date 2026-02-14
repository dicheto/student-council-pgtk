'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/contexts/LanguageContext'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, ArrowRight } from 'lucide-react'

type LocalizedText = string | { bg?: string; en?: string } | null

interface NewsRow {
  id: string
  title: LocalizedText
  slug: string
  excerpt: LocalizedText
  images_urls: string[] | null
  author_id: string
  created_at: string
  status: string
}

interface NewsCard {
  id: string
  title: string
  slug: string
  excerpt: string
  coverUrl: string | null
  created_at: string
}

function pickLocale(value: LocalizedText, locale: 'bg' | 'en') {
  if (!value) return ''
  if (typeof value === 'string') return value
  return value?.[locale] || value?.bg || value?.en || ''
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsCard[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const supabase = createClient()
  const locale: 'bg' | 'en' = 'bg'

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const fetchNews = async () => {
      try {
        const { data, error } = await supabase
          .from('news')
          .select('id,title,slug,excerpt,images_urls,author_id,created_at,status')
          .eq('status', 'published')
          .order('created_at', { ascending: false })

        if (error) throw error

        const mapped = ((data || []) as NewsRow[]).map((row) => {
          const images = row.images_urls || []
          return {
            id: row.id,
            title: pickLocale(row.title, locale),
            slug: row.slug,
            excerpt: pickLocale(row.excerpt, locale),
            coverUrl: images.length > 0 ? images[0] : null,
            created_at: row.created_at,
          } satisfies NewsCard
        })

        setNews(mapped)
      } catch (error: any) {
        // Ignore AbortError - it's normal when component unmounts
        if (error?.name === 'AbortError' || error?.message?.includes('aborted')) {
          return
        }
        console.error('Error fetching news:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [mounted])

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0b0d12]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-white dark:bg-[#0b0d12] pt-24 pb-20">
      <div className="pointer-events-none absolute inset-0 bg-apple-grid opacity-35" />
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-[0.03] dark:opacity-[0.04]" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-10">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.21, 0.61, 0.35, 1] }}
          >
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 apple-glass">
              <span className="text-xs font-semibold tracking-wide text-slate-700 dark:text-slate-200">
                Актуално от съвета
              </span>
            </div>
            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Новини, поднесени спокойно и ясно.
            </h1>
            <p className="mt-3 max-w-xl text-sm sm:text-base text-slate-600 dark:text-slate-300">
              Всички съобщения и важни моменти от училищния живот, събрани на едно място.
            </p>
          </motion.div>
        </header>

        {/* News Grid */}
        <section>
          {news.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-lg text-slate-600 dark:text-slate-300">Няма публикувани новини.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {news.map((article, index) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06, duration: 0.4 }}
                  className="group overflow-hidden rounded-3xl hairline bg-white/70 transition-transform duration-300 hover:-translate-y-1 dark:bg-white/5"
                >
                  {article.coverUrl && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={article.coverUrl}
                        alt={article.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </div>
                  )}
                  <div className="px-5 pb-5 pt-4">
                    <h2 className="line-clamp-2 text-base font-semibold text-slate-900 transition-colors group-hover:text-primary dark:text-white">
                      {article.title}
                    </h2>
                    <p className="mt-2 line-clamp-2 text-xs text-slate-600 dark:text-slate-300">
                      {article.excerpt}
                    </p>

                    <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <div className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{new Date(article.created_at).toLocaleDateString('bg-BG')}</span>
                      </div>
                      <Link
                        href={`/news/${article.slug}`}
                        className="inline-flex items-center gap-1 font-semibold text-primary hover:text-primary-dark dark:hover:text-primary-light"
                      >
                        Прочети
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
