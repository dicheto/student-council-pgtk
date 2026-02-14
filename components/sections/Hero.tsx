'use client'

import { motion } from 'framer-motion'
import { ArrowRight, CalendarDays, Newspaper, Images, Sparkles } from 'lucide-react'
import { AnimatedLogo } from '@/components/animations/AnimatedLogo'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useDictionary } from '@/lib/hooks/useDictionary'

export function Hero() {
  const [mounted, setMounted] = useState(false)
  const { t } = useDictionary()

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section
      id="home"
      className="relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-24"
    >
      {/* Background: calm, Apple-ish, no external assets */}
      <div className="absolute inset-0 bg-white dark:bg-[#0b0d12]" />
      <div className="absolute inset-0 bg-apple-grid opacity-60" />
      <div className="absolute inset-0 bg-noise opacity-[0.035] dark:opacity-[0.04]" />
      <div
        className="absolute -top-32 left-1/2 h-[520px] w-[920px] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(closest-side, rgba(135,206,235,0.32), rgba(0,71,171,0.14), transparent 70%)',
        }}
      />
      <div
        className="absolute -bottom-40 right-[-10%] h-[520px] w-[680px] rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(closest-side, rgba(245,158,11,0.18), rgba(135,206,235,0.10), transparent 70%)',
        }}
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          {/* Copy */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.21, 0.61, 0.35, 1] }}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 apple-glass"
            >
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {t('hero.badge', 'ПГТК „"')}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.08, ease: [0.21, 0.61, 0.35, 1] }}
              className="mt-6 text-5xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-7xl"
            >
              {t('hero.title', 'Ученическият съвет, направен да работи')}
              <br />
              <span className="text-primary">{t('hero.title_highlight', 'за вас')}</span>.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.16, ease: [0.21, 0.61, 0.35, 1] }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-300"
            >
              {t('hero.subtitle', 'Новини, събития и инициативи — подредени ясно, без шум. Една страница, която изглежда спокойно, но движи нещата напред.')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.24, ease: [0.21, 0.61, 0.35, 1] }}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Link
                href="/events"
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition-transform hover:-translate-y-0.5 active:translate-y-0 dark:bg-white dark:text-slate-900"
              >
                {t('hero.cta_events', 'Виж предстоящите години')}
              </Link>

              <Link
                href="/news"
                className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-primary hover:bg-primary/5 dark:hover:bg-white/5"
              >
                {t('hero.cta_news', 'Прочети новините')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.32, ease: [0.21, 0.61, 0.35, 1] }}
              className="mt-10 grid grid-cols-3 gap-3"
            >
              {[
                { label: 'hero.stat_events', value: '50+', icon: CalendarDays },
                { label: 'hero.stat_news', value: 'Винаги', icon: Newspaper },
                { label: 'hero.stat_moments', value: 'Галерия', icon: Images },
              ].map((item) => (
                <div key={item.label} className="apple-glass px-4 py-4">
                  <item.icon className="h-4 w-4 text-slate-500 dark:text-slate-300" />
                  <div className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                    {item.value}
                  </div>
                  <div className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-300">
                    {t(item.label, item.label)}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Visual */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 22, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.12, ease: [0.21, 0.61, 0.35, 1] }}
              className="relative mx-auto max-w-xl"
            >
              <div className="apple-glass relative overflow-hidden p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="relative rounded-2xl bg-gradient-to-br from-primary/10 via-white/60 to-accent/10 p-2.5 dark:from-primary/20 dark:via-white/10 dark:to-accent/20"
                      animate={{ 
                        boxShadow: [
                          '0 0 0 0 rgba(0, 71, 171, 0)',
                          '0 0 0 8px rgba(0, 71, 171, 0.08)',
                          '0 0 0 0 rgba(0, 71, 171, 0)',
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <AnimatedLogo size={44} animated={false} transparent={true} rotating={false} />
                    </motion.div>
                    <div>
                      <div className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                        {t('hero.dashboard_title', 'Табло на съвета')}
                      </div>
                      <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {t('hero.dashboard_subtitle', 'Днес • обновено в реално време')}
                      </div>
                    </div>
                  </div>
                  <motion.div 
                    className="hidden sm:flex items-center gap-2 rounded-full px-3 py-1.5 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200/50 dark:border-emerald-500/20"
                    animate={{ 
                      borderColor: [
                        'rgba(16, 185, 129, 0.2)',
                        'rgba(16, 185, 129, 0.4)',
                        'rgba(16, 185, 129, 0.2)',
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                      {t('hero.dashboard_status', 'Онлайн')}
                    </span>
                  </motion.div>
                </div>

                <div className="mt-6 grid gap-3">
                  {[
                    { title: 'hero.card1_title', desc: 'hero.card1_desc', tone: 'from-primary/18 to-transparent', glow: 'hover:shadow-primary/10' },
                    { title: 'hero.card2_title', desc: 'hero.card2_desc', tone: 'from-slate-900/8 to-transparent dark:from-white/10', glow: 'hover:shadow-slate-500/10' },
                    { title: 'hero.card3_title', desc: 'hero.card3_desc', tone: 'from-accent/14 to-transparent', glow: 'hover:shadow-accent/10' },
                  ].map((card, i) => (
                    <motion.div
                      key={card.title}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.22 + i * 0.08, duration: 0.6, ease: [0.21, 0.61, 0.35, 1] }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      className={`group relative overflow-hidden rounded-2xl hairline bg-white/50 px-5 py-4 dark:bg-white/5 transition-all duration-300 cursor-pointer hover:shadow-xl ${card.glow}`}
                    >
                      <div
                        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${card.tone} group-hover:opacity-80 transition-opacity`}
                      />
                      <div className="relative">
                        <div className="flex items-start justify-between">
                          <div className="text-sm font-bold text-slate-900 dark:text-white">
                            {t(card.title, card.title)}
                          </div>
                          <motion.div
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            initial={{ x: -10 }}
                            whileHover={{ x: 0 }}
                          >
                            <ArrowRight className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                          </motion.div>
                        </div>
                        <div className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">
                          {t(card.desc, card.desc)}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* glossy highlight with shimmer */}
                <motion.div
                  className="pointer-events-none absolute -top-24 left-1/2 h-56 w-[520px] -translate-x-1/2 rotate-6 rounded-full opacity-60 blur-2xl"
                  animate={{
                    x: ['-50%', '-48%', '-50%'],
                    opacity: [0.6, 0.8, 0.6],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  style={{
                    background:
                      'radial-gradient(closest-side, rgba(255,255,255,0.9), rgba(135,206,235,0.3), transparent 70%)',
                  }}
                />
              </div>

              {mounted && (
                <motion.div
                  className="pointer-events-none absolute -inset-8 -z-10 rounded-[48px]"
                  animate={{ opacity: [0.22, 0.34, 0.22] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    background:
                      'radial-gradient(circle at 30% 30%, rgba(0,71,171,0.18), transparent 55%), radial-gradient(circle at 70% 70%, rgba(245,158,11,0.10), transparent 60%)',
                    filter: 'blur(22px)',
                  }}
                />
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
