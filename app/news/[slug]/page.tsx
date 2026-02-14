'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, ArrowLeft, Share2, Newspaper } from 'lucide-react'
import { useLanguage } from '@/lib/contexts/LanguageContext'

type LocalizedText = string | { bg?: string; en?: string } | null

interface NewsDetailRow {
  id: string
  title: LocalizedText
  slug: string
  content: LocalizedText
  excerpt: LocalizedText
  images_urls: string[] | null
  author_id: string
  created_at: string
  updated_at: string
}

interface NewsDetail {
  id: string
  title: string
  slug: string
  contentHtml: string
  excerpt: string
  featuredImageUrl: string | null
  images: string[]
  created_at: string
  updated_at: string
}

function pickLocale(value: LocalizedText, locale: 'bg' | 'en') {
  if (!value) return ''
  if (typeof value === 'string') return value
  return value?.[locale] || value?.bg || value?.en || ''
}

export default function NewsDetailPage({ params }: { params: { slug: string } }) {
  const [article, setArticle] = useState<NewsDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const supabase = createClient()
  const { language } = useLanguage()
  const locale = language

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const { data, error } = await supabase
          .from('news')
          .select('id,title,slug,content,excerpt,images_urls,author_id,created_at,updated_at,status')
          .eq('slug', params.slug)
          .eq('status', 'published')
          .maybeSingle()

        if (error) {
          console.error('Supabase error:', error)
          setError(true)
          return
        }

        if (!data) {
          console.log('No article found with slug:', params.slug)
          setError(true)
          return
        }

        const row = data as NewsDetailRow
        const images = row.images_urls || []

        setArticle({
          id: row.id,
          title: pickLocale(row.title, locale),
          slug: row.slug,
          contentHtml: pickLocale(row.content, locale),
          excerpt: pickLocale(row.excerpt, locale),
          featuredImageUrl: images.length > 0 ? images[0] : null,
          images,
          created_at: row.created_at,
          updated_at: row.updated_at,
        })
      } catch (err) {
        console.error('Error fetching article:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0b0d12]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="relative min-h-screen bg-white dark:bg-[#0b0d12] overflow-hidden">
        <div className="absolute inset-0 bg-apple-grid opacity-40" />
        <div className="absolute inset-0 bg-noise opacity-[0.03] dark:opacity-[0.04]" />
        
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4 pt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500/10 to-orange-500/10 backdrop-blur-xl border border-white/20 dark:border-white/10">
              <Newspaper className="h-10 w-10 text-red-500" />
            </div>
            
            <h1 className="mb-3 text-3xl font-bold text-slate-900 dark:text-white">
              Статията не е намерена
            </h1>
            <p className="mb-8 text-slate-600 dark:text-slate-300 max-w-md mx-auto">
              Търсената статия не съществува или е била премахната.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/news"
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 dark:bg-white dark:text-slate-900"
              >
                <ArrowLeft className="h-4 w-4" />
                Назад към новините
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/50 px-6 py-3 text-sm font-semibold text-slate-900 backdrop-blur-sm transition-all hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
              >
                Начална страница
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-white dark:bg-[#0b0d12] pt-24 pb-20">
      <div className="pointer-events-none absolute inset-0 bg-apple-grid opacity-30" />
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-[0.03] dark:opacity-[0.04]" />

      {/* Header with Featured Image */}
      {article.featuredImageUrl && (
        <div className="relative z-0 mb-10 h-72 overflow-hidden rounded-none sm:h-80 lg:h-96">
          <img
            src={article.featuredImageUrl}
            alt={article.title}
            className="h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
        </div>
      )}

      {/* Article Content */}
      <article className="container relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.21, 0.61, 0.35, 1] }}
        >
          {/* Back Link */}
          <Link
            href="/news"
            className="mb-6 inline-flex items-center text-sm font-semibold text-primary hover:text-primary-dark dark:hover:text-primary-light"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Назад към новините
          </Link>

          {/* Title */}
          <h1 className="mb-4 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            {article.title}
          </h1>

          {/* Meta Info */}
          <div className="mb-8 flex items-center justify-between border-b border-black/5 pb-4 text-xs text-slate-500 dark:border-white/10 dark:text-slate-300">
            <div className="flex items-center gap-4">
              <div className="inline-flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  {new Date(article.created_at).toLocaleDateString('bg-BG', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              {article.updated_at !== article.created_at && (
                <span className="hidden sm:inline">
                  Обновено:{' '}
                  {new Date(article.updated_at).toLocaleDateString('bg-BG', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              )}
            </div>
            <button className="inline-flex items-center gap-1 text-primary hover:text-primary-dark dark:hover:text-primary-light">
              <Share2 className="h-3.5 w-3.5" />
              <span>Сподели</span>
            </button>
          </div>

          {/* Content */}
          <div className="prose prose-slate max-w-none text-slate-800 dark:prose-invert dark:text-slate-100 prose-headings:font-semibold prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:leading-relaxed prose-a:text-primary dark:prose-a:text-primary-light prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-900 dark:prose-strong:text-white">
            <div
              className="text-base leading-relaxed sm:text-lg"
              dangerouslySetInnerHTML={{ __html: article.contentHtml }}
            />
          </div>

          {/* Additional Images */}
          {article.images && article.images.length > 0 && (
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {article.images.map((imageUrl, index) => (
                <img
                  key={index}
                  src={imageUrl}
                  alt={`Image ${index + 1}`}
                  className="h-56 w-full rounded-2xl object-cover"
                />
              ))}
            </div>
          )}

          {/* Related Articles */}
          <div className="mt-10 rounded-2xl apple-glass px-6 py-5">
            <h3 className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">
              Още от новините
            </h3>
            <Link
              href="/news"
              className="text-sm font-semibold text-primary hover:text-primary-dark dark:hover:text-primary-light"
            >
              Преглед на всички новини →
            </Link>
          </div>
        </motion.div>
      </article>
    </div>
  )
}
