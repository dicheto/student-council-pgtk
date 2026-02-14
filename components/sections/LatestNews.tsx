'use client'

import { motion } from 'framer-motion'
import { Calendar, ArrowRight, Newspaper, Clock, User, ExternalLink, BookOpen } from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
import { bg } from 'date-fns/locale'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useLanguage } from '@/lib/contexts/LanguageContext'
import { useDictionary } from '@/lib/hooks/useDictionary'

interface News {
  id: string
  title: string | { bg: string; en: string }
  slug: string
  excerpt: string | { bg: string; en: string }
  created_at: string
  images_urls?: string[]
  author_id?: string
}

// Fallback news when database is empty
const fallbackNews: News[] = [
  {
    id: '1',
    title: 'Добре дошли на новия ни уебсайт!',
    slug: 'dobre-doshli',
    excerpt: 'Радваме се да ви представим напълно обновения уебсайт на Ученическия съвет на ПГТК. Тук ще намерите всички новини, събития и информация за дейността ни.',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Нови проекти за учебната година',
    slug: 'novi-proekti',
    excerpt: 'Ученическият съвет планира множество вълнуващи проекти и инициативи за тази учебна година. Научете повече за нашите планове.',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'Присъедини се към екипа',
    slug: 'prisaedini-se',
    excerpt: 'Търсим активни ученици, които искат да допринесат за живота на училището. Ако искаш да бъдеш част от нас, свържи се с нас!',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

function NewsCard({ item, index, isLarge }: { item: News; index: number; isLarge: boolean }) {
  const { language } = useLanguage()
  const { t } = useDictionary('news')
  const title = typeof item.title === 'object' ? (item.title[language] || item.title.bg || item.title.en) : item.title
  const excerpt = typeof item.excerpt === 'object' ? (item.excerpt[language] || item.excerpt.bg || item.excerpt.en) : item.excerpt
  const createdAt = new Date(item.created_at)
  const hasImage = item.images_urls && item.images_urls.length > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`group ${isLarge ? 'md:col-span-2 lg:row-span-2' : ''}`}
    >
      <Link href={`/news/${item.slug}`}>
        <motion.div
          className={`relative h-full rounded-3xl overflow-hidden bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 ${
            isLarge ? 'flex flex-col' : ''
          }`}
          whileHover={{ y: -8 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {/* Image area */}
          <div className={`relative ${isLarge ? 'h-64' : 'h-48'} overflow-hidden bg-gradient-to-br from-primary/10 to-primary-light/10`}>
            {hasImage ? (
              <img 
                src={item.images_urls![0]} 
                alt={title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <motion.div
                  className="relative"
                  animate={{ 
                    y: [0, -5, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Newspaper className={`${isLarge ? 'w-24 h-24' : 'w-16 h-16'} text-primary/30 dark:text-primary-light/30`} />
                </motion.div>
              </div>
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* Date badge */}
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-xs font-medium text-gray-700 dark:text-gray-300">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(createdAt, { addSuffix: true, locale: bg })}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 flex-1 flex flex-col">
            <h3 className={`font-display font-bold ${isLarge ? 'text-2xl' : 'text-xl'} text-gray-900 dark:text-white mb-3 group-hover:text-primary dark:group-hover:text-primary-light transition-colors line-clamp-2`}>
              {title}
            </h3>
            
            <p className={`text-gray-600 dark:text-gray-400 text-sm mb-4 flex-1 ${isLarge ? 'line-clamp-4' : 'line-clamp-2'}`}>
              {excerpt}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-700">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{format(createdAt, 'd MMM yyyy', { locale: bg })}</span>
              </div>
              
              <motion.span
                className="inline-flex items-center gap-1 text-primary dark:text-primary-light font-medium text-sm"
                whileHover={{ x: 4 }}
              >
                {t('read_btn', 'Прочети')}
                <ArrowRight className="w-4 h-4" />
              </motion.span>
            </div>
          </div>

          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"
          />
        </motion.div>
      </Link>
    </motion.div>
  )
}

export function LatestNews() {
  const [mounted, setMounted] = useState(false)
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const { t } = useDictionary('news')

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const fetchNews = async () => {
      try {
        const { data, error } = await supabase
          .from('news')
          .select('id, title, slug, excerpt, created_at, images_urls, author_id')
          .eq('status', 'published')
          .order('created_at', { ascending: false })
          .limit(3)

        if (error) throw error
        setNews(data && data.length > 0 ? data : fallbackNews)
      } catch (error: any) {
        // Ignore AbortError - it's normal when component unmounts
        if (error?.name === 'AbortError' || error?.message?.includes('aborted')) {
          return
        }
        console.error('Error fetching news:', error)
        setNews(fallbackNews)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [mounted])

  return (
    <section id="news" className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800">
      <div className="container mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-accent to-accent-light mb-6 shadow-xl shadow-accent/30"
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
          >
            <BookOpen className="w-10 h-10 text-white" />
          </motion.div>
          
          <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl mb-4 text-gray-900 dark:text-white">
            {t('title', 'Последни')}{' '}
            <span className="bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
              {t('title_highlight', 'Новини')}
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('subtitle', 'Бъдете в течение с последните новини и събития от нашия ученически съвет')}
          </p>
        </motion.div>

        {/* News Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <motion.div
              className="w-12 h-12 rounded-full border-4 border-accent/30 border-t-accent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        ) : news.length === 0 ? (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Newspaper className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {t('empty_message', 'Все още няма публикувани новини')}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {mounted && news.map((item, index) => (
              <NewsCard 
                key={item.id} 
                item={item} 
                index={index}
                isLarge={index === 0}
              />
            ))}
          </div>
        )}

        {/* View All Link */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <Link href="/news">
            <motion.span
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-accent via-accent-light to-accent text-white rounded-full font-semibold shadow-glow-accent hover:shadow-glow-accent-lg transition-all cursor-pointer relative overflow-hidden group"
              style={{ backgroundSize: '200% 100%' }}
              animate={{ backgroundPosition: ['0% center', '200% center'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Newspaper className="w-5 h-5 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
              </motion.div>
              {t('view_all_btn', 'Виж всички новини')}
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ExternalLink className="w-4 h-4" />
              </motion.div>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full"
                transition={{ duration: 0.6 }}
              />
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
