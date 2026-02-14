'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
  Image as ImageIcon,
  ZoomIn,
  Camera,
  ArrowRight,
  ExternalLink,
  Play,
  Images,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useDictionary } from '@/lib/hooks/useDictionary'

interface GalleryItem {
  id: string
  title: string
  description: string
  gradient: string
  count: number
  featured?: boolean
  imageUrl?: string
  viewUrl?: string
}

const fallbackItems: GalleryItem[] = [
  {
    id: '1',
    title: 'Спортни събития',
    description: 'Състезания, турнири и спортни празници',
    gradient: 'from-blue-500 via-cyan-500 to-teal-500',
    count: 24,
    featured: true,
  },
  {
    id: '2',
    title: 'Културни мероприятия',
    description: 'Концерти, театър и изкуство',
    gradient: 'from-purple-500 via-pink-500 to-rose-500',
    count: 18,
  },
  {
    id: '3',
    title: 'Образователни инициативи',
    description: 'Семинари, уъркшопи и обучения',
    gradient: 'from-amber-500 via-orange-500 to-red-500',
    count: 15,
  },
  {
    id: '4',
    title: 'Благотворителни акции',
    description: 'Дарителски кампании и доброволчество',
    gradient: 'from-green-500 via-emerald-500 to-teal-500',
    count: 12,
  },
  {
    id: '5',
    title: 'Празници',
    description: 'Коледа, Великден и други тържества',
    gradient: 'from-red-500 via-pink-500 to-purple-500',
    count: 20,
  },
  {
    id: '6',
    title: 'Абитуриенти',
    description: 'Балове и завършващи класове',
    gradient: 'from-indigo-500 via-blue-500 to-cyan-500',
    count: 30,
  },
]

function GalleryCard({ item, index }: { item: GalleryItem; index: number }) {
  const [isHovered, setIsHovered] = useState(false)
  const { t } = useDictionary('gallery')

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`group cursor-pointer ${item.featured ? 'md:col-span-2 md:row-span-2' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className={`relative h-full overflow-hidden rounded-3xl ${
          item.featured ? 'min-h-[400px]' : 'min-h-[250px]'
        }`}
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {/* Gradient / image Background */}
        <div className="absolute inset-0">
          {item.imageUrl ? (
            <div className="absolute inset-0">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/40" />
            </div>
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient}`}>
              {/* Animated mesh overlay */}
              <motion.div
                className="absolute inset-0 opacity-30"
                animate={{
                  backgroundPosition: isHovered ? ['0% 0%', '100% 100%'] : '0% 0%',
                }}
                transition={{ duration: 3, ease: 'linear' }}
                style={{
                  backgroundImage:
                    'radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 50%)',
                  backgroundSize: '100px 100px',
                }}
              />
            </div>
          )}
        </div>

        {/* Pattern overlay */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

        {/* Icon placeholder */}
        {!item.imageUrl && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{
              scale: isHovered ? 0.8 : 1,
              opacity: isHovered ? 0.2 : 0.3,
            }}
          >
            <ImageIcon
              className={`${item.featured ? 'w-32 h-32' : 'w-20 h-20'} text-white`}
            />
          </motion.div>
        )}

        {/* Hover overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="p-4 rounded-full bg-white/20 backdrop-blur-md"
              >
                <ZoomIn className="w-8 h-8 text-white" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6 flex flex-col justify-end">
          <motion.div
            animate={{
              y: isHovered ? -10 : 0,
            }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium mb-3 w-fit"
              animate={{
                scale: isHovered ? 1.05 : 1,
              }}
            >
              <Camera className="w-3.5 h-3.5" />
              {item.count} {t('images_label', 'снимки')}
            </motion.div>

            <h3 className={`font-display font-bold ${item.featured ? 'text-3xl' : 'text-xl'} text-white mb-2`}>
              {item.title}
            </h3>
            
            <motion.p
              className="text-white/80 text-sm"
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: isHovered ? 1 : 0,
                height: isHovered ? 'auto' : 0,
              }}
            >
              {item.description}
            </motion.p>
          </motion.div>

          {/* Play button for featured */}
          {item.featured && !item.imageUrl && (
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              animate={{
                scale: isHovered ? [1, 1.1, 1] : 1,
                opacity: isHovered ? 0 : 0.7,
              }}
              transition={{ duration: 1.5, repeat: isHovered ? 0 : Infinity }}
            >
              <div className="p-6 rounded-full bg-white/30 backdrop-blur-sm">
                <Play className="w-12 h-12 text-white fill-white" />
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export function GalleryHighlights() {
  const [mounted, setMounted] = useState(false)
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const { t } = useDictionary('gallery')

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const load = async () => {
      try {
        const res = await fetch('/api/gallery/drive')
        if (!res.ok) {
          throw new Error('Failed to load gallery')
        }

        const data = await res.json()
        const files: any[] = data.files || []

        if (!files.length) {
          setItems(fallbackItems)
          return
        }

        const gradients = [
          'from-blue-500 via-cyan-500 to-teal-500',
          'from-purple-500 via-pink-500 to-rose-500',
          'from-amber-500 via-orange-500 to-red-500',
          'from-green-500 via-emerald-500 to-teal-500',
          'from-red-500 via-pink-500 to-purple-500',
          'from-indigo-500 via-blue-500 to-cyan-500',
        ]

        const mapped: GalleryItem[] = files.map((file, index) => ({
          id: file.id,
          title: file.name || 'Снимка',
          description: file.description || 'Момент от нашите събития',
          gradient: gradients[index % gradients.length],
          count: 1,
          featured: index === 0,
          imageUrl: file.thumbnailUrl || undefined,
          viewUrl: file.viewUrl || undefined,
        }))

        setItems(mapped)
      } catch (err) {
        console.error('Error loading gallery:', err)
        setItems(fallbackItems)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [mounted])

  return (
    <section id="gallery" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-900">
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
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 mb-6 shadow-xl shadow-purple-500/30"
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
          >
            <Images className="w-10 h-10 text-white" />
          </motion.div>
          
          <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl mb-4 text-gray-900 dark:text-white">
            {t('title', 'Нашата')}{' '}
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              {t('title_highlight', 'Галерия')}
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('subtitle', 'Колекция от красиви спомени от нашия ученически съвет')}
          </p>
        </motion.div>

        {/* Masonry-style Grid */}
        {mounted && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {items.map((item, index) => (
              <GalleryCard key={item.id} item={item} index={index} />
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
          {items[0]?.viewUrl ? (
            <motion.a
              href={items[0].viewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 text-white rounded-full font-semibold shadow-glow-neon-purple hover:shadow-glow-neon-purple transition-all cursor-pointer overflow-hidden group"
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
                <Camera className="w-5 h-5 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
              </motion.div>
              {t('open_drive_button', 'Отвори албума в Google Drive')}
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
            </motion.a>
          ) : (
            <Link href="/gallery">
              <motion.span
                className="relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 text-white rounded-full font-semibold shadow-glow-neon-purple hover:shadow-glow-neon-purple transition-all cursor-pointer overflow-hidden group"
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
                  <Camera className="w-5 h-5 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                </motion.div>
                {t('view_all_btn', 'Виж цялата галерия')}
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
          )}
        </motion.div>
      </div>
    </section>
  )
}
