'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Newspaper, ArrowLeft } from 'lucide-react'
import { NewsForm } from '@/components/admin/news/NewsForm'

export default function CreateNewsPage() {
  const router = useRouter()

  const handleClose = () => {
    router.push('/admin/news')
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-slate-950 bg-apple-grid/40 pt-4 pb-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.21, 0.61, 0.35, 1] }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleClose}
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Назад към всички новини</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900/80 ring-1 ring-white/10 shadow-lg shadow-slate-900/60">
                <Newspaper className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
                  Нова новина
                </h1>
                <p className="text-sm text-slate-400">
                  Създай статия с богато съдържание, изображения и помощ от AI.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.21, 0.61, 0.35, 1], delay: 0.05 }}
          className="apple-glass relative overflow-hidden border border-white/5 bg-slate-950/40"
        >
          <div className="pointer-events-none absolute inset-x-12 -top-32 h-64 bg-gradient-to-b from-primary/20 via-primary/5 to-transparent blur-3xl" />
          <div className="relative p-4 sm:p-6 lg:p-8">
            <NewsForm onClose={handleClose} />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
