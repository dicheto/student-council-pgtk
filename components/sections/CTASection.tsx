'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Mail } from 'lucide-react'
import Link from 'next/link'
import { AnimatedLogo } from '@/components/animations/AnimatedLogo'
import { useDictionary } from '@/lib/hooks/useDictionary'

export function CTASection() {
  const { t } = useDictionary('cta')
  return (
    <section className="relative overflow-hidden py-20 sm:py-24">
      <div className="absolute inset-0 bg-white dark:bg-[#0b0d12]" />
      <div className="absolute inset-0 bg-apple-grid opacity-25" />
      <div className="absolute inset-0 bg-noise opacity-[0.03] dark:opacity-[0.04]" />

      {/* Soft brand glow */}
      <div
        className="absolute -top-40 left-1/3 h-[520px] w-[820px] -translate-x-1/2 rounded-full blur-3xl opacity-70"
        style={{
          background:
            'radial-gradient(closest-side, rgba(0,71,171,0.18), rgba(135,206,235,0.10), transparent 70%)',
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.21, 0.61, 0.35, 1] }}
          className="mx-auto max-w-5xl"
        >
          <div className="apple-glass overflow-hidden p-8 sm:p-12">
            <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-3">
                  <div className="rounded-2xl bg-white/60 p-2.5 dark:bg-white/10">
                    <AnimatedLogo size={40} transparent rotating={false} animated={false} />
                  </div>
                  <div className="text-xs font-semibold tracking-wide text-slate-600 dark:text-slate-300">
                    {t('badge', 'Покана за участие')}
                  </div>
                </div>

                <h2 className="mt-6 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-900 dark:text-white">
                  {t('title', 'Идея. Екип. Действие.')}
                </h2>
                <p className="mt-3 text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                  {t('subtitle', 'Ако имаш енергия да подобряваш училищния живот — тук е мястото. Ние организираме, комуникираме и довършваме започнатото.')}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition-transform hover:-translate-y-0.5 active:translate-y-0 dark:bg-white dark:text-slate-900"
                >
                  <Mail className="h-4 w-4" />
                  {t('cta1_btn', 'Свържи се с нас')}
                </Link>

                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-primary hover:bg-primary/5 dark:hover:bg-white/5"
                >
                  {t('cta2_btn', 'Научи повече')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                { title: 'feature1_title', desc: 'feature1_desc' },
                { title: 'feature2_title', desc: 'feature2_desc' },
                { title: 'feature3_title', desc: 'feature3_desc' },
              ].map((f) => (
                <div key={f.title} className="rounded-2xl hairline bg-white/50 p-5 dark:bg-white/5">
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">
                    {t(f.title, f.title)}
                  </div>
                  <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    {t(f.desc, f.desc)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
