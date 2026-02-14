'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, ArrowLeft, Search, FileQuestion } from 'lucide-react'
import { AnimatedLogo } from '@/components/animations/AnimatedLogo'

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-white dark:bg-[#0b0d12] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-apple-grid opacity-40" />
      <div className="absolute inset-0 bg-noise opacity-[0.03] dark:opacity-[0.04]" />
      
      {/* Animated background blobs */}
      <div
        className="absolute -top-32 left-1/2 h-[520px] w-[920px] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(closest-side, rgba(135,206,235,0.25), rgba(0,71,171,0.10), transparent 70%)',
        }}
      />
      <div
        className="absolute -bottom-40 right-[-10%] h-[520px] w-[680px] rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(closest-side, rgba(245,158,11,0.15), rgba(135,206,235,0.08), transparent 70%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.21, 0.61, 0.35, 1] }}
          >
            {/* Animated Icon */}
            <motion.div
              className="mx-auto mb-8 flex h-32 w-32 items-center justify-center"
              animate={{ 
                rotate: [0, 10, -10, 0],
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="relative">
                <motion.div
                  className="absolute inset-0 rounded-full bg-primary/20 blur-2xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
                <div className="relative flex h-32 w-32 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/10 via-white/60 to-accent/10 dark:from-primary/20 dark:via-white/10 dark:to-accent/20 backdrop-blur-xl border border-white/20 dark:border-white/10">
                  <FileQuestion className="h-16 w-16 text-primary dark:text-primary-light" />
                </div>
              </div>
            </motion.div>

            {/* 404 Text */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="mb-4"
            >
              <h1 className="text-8xl font-bold tracking-tighter text-slate-900 dark:text-white sm:text-9xl">
                404
              </h1>
            </motion.div>

            {/* Message */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-3"
            >
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                Страницата не е намерена
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mx-auto mb-10 max-w-md text-base text-slate-600 dark:text-slate-300 sm:text-lg"
            >
              За съжаление страницата, която търсите, не съществува или е била преместена.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <Link
                href="/"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition-all hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 dark:bg-white dark:text-slate-900"
              >
                <Home className="h-4 w-4 transition-transform group-hover:scale-110" />
                Начална страница
              </Link>

              <Link
                href="/news"
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white/50 px-6 py-3 text-sm font-semibold text-slate-900 backdrop-blur-sm transition-all hover:bg-white hover:shadow-lg dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
              >
                <Search className="h-4 w-4 transition-transform group-hover:scale-110" />
                Разгледай новините
              </Link>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-12 apple-glass inline-block rounded-2xl px-8 py-4"
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Полезни връзки
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                <Link
                  href="/events"
                  className="font-medium text-primary transition-colors hover:text-primary-dark dark:text-primary-light dark:hover:text-primary"
                >
                  Събития
                </Link>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <Link
                  href="/gallery"
                  className="font-medium text-primary transition-colors hover:text-primary-dark dark:text-primary-light dark:hover:text-primary"
                >
                  Галерия
                </Link>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <Link
                  href="/about"
                  className="font-medium text-primary transition-colors hover:text-primary-dark dark:text-primary-light dark:hover:text-primary"
                >
                  За нас
                </Link>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <Link
                  href="/contact"
                  className="font-medium text-primary transition-colors hover:text-primary-dark dark:text-primary-light dark:hover:text-primary"
                >
                  Контакти
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
