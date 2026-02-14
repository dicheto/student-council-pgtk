'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { Lightbox } from '@/components/sections/GalleryHighlights'

interface GalleryItem {
  id: string
  title: string
  description: string
  image_url: string
  thumbnail_url: string
  category: string
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [categories, setCategories] = useState<string[]>([])
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const fetchGallery = async () => {
      try {
        const { data } = await supabase
          .from('gallery')
          .select('*')
          .order('created_at', { ascending: false })

        if (data) {
          setItems(data)
          const uniqueCategories = [...new Set(data.map(item => item.category).filter(Boolean))]
          setCategories(uniqueCategories as string[])
        }
      } catch (error: any) {
        // Ignore AbortError - it's normal when component unmounts
        if (error?.name === 'AbortError' || error?.message?.includes('aborted')) {
          return
        }
        console.error('Error fetching gallery:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGallery()
  }, [mounted])

  const filteredItems = selectedCategory
    ? items.filter(item => item.category === selectedCategory)
    : items

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
        <header className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.21, 0.61, 0.35, 1] }}
          >
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 apple-glass">
              <span className="text-xs font-semibold tracking-wide text-slate-700 dark:text-slate-200">
                Моменти от училищния живот
              </span>
            </div>
            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Галерия, която разказва истории.
            </h1>
            <p className="mt-3 max-w-xl text-sm sm:text-base text-slate-600 dark:text-slate-300">
              Разгледай снимки от събития, инициативи и ежедневни моменти в ПГТК.
            </p>
          </motion.div>
        </header>

        {/* Category Filter */}
        {categories.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
              Категории
            </h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                  selectedCategory === null
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'hairline bg-white/70 text-slate-800 hover:bg-white dark:bg-white/5 dark:text-slate-100 dark:hover:bg-white/10'
                }`}
              >
                Всички
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                    selectedCategory === category
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'hairline bg-white/70 text-slate-800 hover:bg-white dark:bg-white/5 dark:text-slate-100 dark:hover:bg-white/10'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Gallery Grid */}
        <section>
          {filteredItems.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Няма снимки в тази категория… все още.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 18, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.04, duration: 0.4 }}
                  className="group cursor-pointer overflow-hidden rounded-3xl hairline bg-white/60 dark:bg-white/5"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={item.thumbnail_url || item.image_url}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>
                  <div className="px-5 pb-5 pt-4">
                    <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="mt-1 line-clamp-2 text-xs text-slate-600 dark:text-slate-300">
                        {item.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
