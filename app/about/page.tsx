'use client'

import { Metadata } from 'next'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { 
  Users, Target, Heart, Award, Star, Sparkles, 
  ChevronRight, ArrowRight, GraduationCap, Lightbulb,
  Handshake, Trophy, Rocket, Quote
} from 'lucide-react'
import { useRef } from 'react'
import { AnimatedLogo } from '@/components/animations/AnimatedLogo'
import { useDictionary } from '@/lib/hooks/useDictionary'
import { useSiteSettings } from '@/lib/hooks/useSiteSettings'

export default function AboutPage() {
  const { t, loading } = useDictionary('about')
  const { settings } = useSiteSettings()

  const stats = [
    { label: t('about.stats.members', 'Членове'), value: '200', suffix: '+', icon: Users },
    { label: t('about.stats.events', 'Събития/година'), value: '50', suffix: '+', icon: Trophy },
    { label: t('about.stats.years', 'Години история'), value: '10', suffix: '+', icon: Star },
    { label: t('about.stats.projects', 'Активни проекти'), value: '15', suffix: '+', icon: Rocket },
  ]

  const values = [
    {
      icon: Heart,
      title: t('about.value1_title', 'Сърце и дух'),
      description: t('about.value1_desc', 'Вярваме в силата на общността и колективния дух. Всеки ученик е важен.'),
      color: 'from-rose-500 to-pink-500',
    },
    {
      icon: Target,
      title: t('about.value2_title', 'Цел и фокус'),
      description: t('about.value2_desc', 'Поставяме ясни цели и работим упорито за тяхното постигане.'),
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Handshake,
      title: t('about.value3_title', 'Сътрудничество'),
      description: t('about.value3_desc', 'Работим заедно като един екип за общото благо на всички ученици.'),
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Award,
      title: t('about.value4_title', 'Отличие'),
      description: t('about.value4_desc', 'Стремим се към най-високи стандарти и признаваме отличните постижения.'),
      color: 'from-amber-500 to-orange-500',
    },
    {
      icon: Lightbulb,
      title: t('about.value5_title', 'Иновации'),
      description: t('about.value5_desc', 'Търсим нови и креативни подходи за решаване на проблеми.'),
      color: 'from-purple-500 to-violet-500',
    },
    {
      icon: GraduationCap,
      title: t('about.value6_title', 'Развитие'),
      description: t('about.value6_desc', 'Подкрепяме личностното и професионално развитие на всеки член.'),
      color: 'from-indigo-500 to-blue-500',
    },
  ]

  const milestones = [
    { year: '2014', event: t('about.timeline_2014', 'Основаване на Ученическия съвет') },
    { year: '2016', event: t('about.timeline_2016', 'Първа благотворителна кампания') },
    { year: '2018', event: t('about.timeline_2018', 'Създаване на традиционния есенен бал') },
    { year: '2020', event: t('about.timeline_2020', 'Преминаване към онлайн формат') },
    { year: '2022', event: t('about.timeline_2022', 'Най-много членове в историята') },
    { year: '2024', event: t('about.timeline_2024', 'Нов модерен уебсайт') },
  ]
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })
  
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

  return (
    <div ref={containerRef} className="min-h-screen bg-white dark:bg-slate-900">
      {/* Hero Header */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        {/* Vibrant animated background */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600"
          animate={{
            background: [
              'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
              'linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #4facfe 100%)',
              'linear-gradient(135deg, #4facfe 0%, #00f2fe 50%, #667eea 100%)',
              'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Gradient fade to white/dark at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white dark:from-slate-900 to-transparent z-[1]" />
        
        {/* Animated floating orbs with glow */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 rounded-full bg-cyan-400/30 blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-pink-400/40 blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, -60, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-80 h-80 rounded-full bg-yellow-300/30 blur-3xl"
          animate={{
            x: [-200, 200, -200],
            y: [-100, 100, -100],
            scale: [1, 1.4, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />

        {/* Animated mesh grid */}
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
          animate={{
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        <motion.div 
          className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
          style={{ opacity: heroOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            {/* Badge with neon glow */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/40 mb-6 shadow-lg shadow-cyan-500/50"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(34, 211, 238, 0.8)' }}
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-sm text-white font-bold tracking-wider">{t('about.badge', 'ПГТК')}</span>
            </motion.div>

            <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-white mb-6 drop-shadow-2xl">
              {t('about.title', 'За нас').split(' ')[0]}{' '}
              <span className="bg-gradient-to-r from-cyan-300 via-pink-300 to-yellow-300 bg-clip-text text-transparent animate-pulse">
                {t('about.title', 'За нас').split(' ')[1]}
              </span>
            </h1>
            <p className="text-xl text-white/95 leading-relaxed mb-8 drop-shadow-lg">
              {t('about.hero_description', 'Ученическият съвет ПГТК е организация на ученици за ученици. Ние сме гласът на всеки ученик и работим за подобряване на училищния живот.')}
            </p>

            {/* Quick stats inline with glow effects */}
            <div className="flex flex-wrap gap-6">
              {stats.slice(0, 3).map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  className="text-center p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/30 shadow-xl hover:shadow-cyan-500/50 transition-all"
                >
                  <span className="block text-4xl font-bold text-white drop-shadow-lg">
                    {stat.value}{stat.suffix}
                  </span>
                  <span className="text-white/80 text-sm font-medium">{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator with glow */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="relative">
            <div className="absolute inset-0 blur-xl bg-white/50 scale-150" />
            <ChevronRight className="relative w-6 h-6 text-white rotate-90" />
          </div>
        </motion.div>
      </section>

      {/* Stats Section with gradient background continuation */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 -mt-20 z-10">
        {/* Subtle gradient background that continues from hero */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-50/50 via-white to-white dark:from-slate-800/50 dark:via-slate-900 dark:to-slate-900" />
        
        {/* Floating color accents */}
        <div className="absolute top-0 left-10 w-64 h-64 bg-purple-200/20 dark:bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-20 right-20 w-48 h-48 bg-pink-200/20 dark:bg-pink-500/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-3xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-purple-100 dark:border-slate-700 shadow-xl hover:shadow-purple-200/50 dark:hover:shadow-purple-500/20 transition-all"
                >
                  <motion.div 
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 flex items-center justify-center mb-4 shadow-lg"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <span className="block text-4xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}{stat.suffix}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">{stat.label}</span>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display font-bold text-4xl sm:text-5xl text-gray-900 dark:text-white mb-6">
                {t('about.mission_title', 'Нашата Мисия').split(' ')[0]}{' '}
                <span className="text-gradient">{t('about.mission_title', 'Нашата Мисия').split(' ')[1]}</span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                {t('about.mission_text1', 'Ученическият съвет работи да създаде динамична и включваща среда, където всеки ученик може да развие своя потенциал, да бъде чут и да внесе своя принос в живота на училището.')}
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                {t('about.mission_text2', 'Ние сме гласът на учащите се и партньори на администрацията в създаването на позитивна училищна общност. Организираме събития, подкрепяме инициативи и правим училището място, в което всеки иска да бъде.')}
              </p>
              
              {/* Quote */}
              <div className="flex gap-4 p-6 rounded-2xl bg-primary/5 dark:bg-primary/10 border border-primary/20">
                <Quote className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <p className="text-gray-700 dark:text-gray-300 italic mb-2">
                    &ldquo;{t('about.quote', 'Заедно можем да постигнем повече, отколкото поотделно. Ученическият съвет е доказателство за това.')}&rdquo;
                  </p>
                  <span className="text-sm text-gray-500 dark:text-gray-400">— {t('about.quote_author', 'Председател на УС')}</span>
                </div>
              </div>
            </motion.div>

            {/* Values Grid */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {values.slice(0, 4).map((value, index) => {
                const Icon = value.icon
                return (
                  <motion.div
                    key={value.title}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-lg"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-3`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">{value.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{value.description}</p>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* All Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-800">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-gray-900 dark:text-white mb-4">
              {t('about.values_title', 'Нашите Ценности')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('about.values_subtitle', 'Принципите, които ни водят във всичко, което правим')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 shadow-xl"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white mb-2">{value.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{value.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-gray-900 dark:text-white mb-4">
              {t('about.history_title', 'Нашата История')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('about.history_subtitle', 'Пътят, който извървяхме заедно')}
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-6 mb-8"
              >
                <div className="flex-shrink-0 w-20 text-right">
                  <span className="font-bold text-2xl text-primary">{milestone.year}</span>
                </div>
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-primary to-primary-light flex-shrink-0 shadow-lg shadow-primary/30" />
                <div className="flex-1 p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
                  <p className="text-gray-700 dark:text-gray-300">{milestone.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-primary-dark to-slate-900 p-12 text-center"
          >
            {/* Background decoration */}
            <motion.div
              className="absolute inset-0 opacity-10"
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            >
              <AnimatedLogo size={400} transparent animated={false} />
            </motion.div>

            <div className="relative z-10">
              <h2 className="font-display font-bold text-4xl sm:text-5xl text-white mb-4">
                {t('about.cta_title', 'Присъедини се към нас!')}
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                {t('about.cta_description', 'Ученическият съвет е отворен за всички ученици, които искат да направят разлика. Независимо дали искаш да организираш събития или просто да помогнеш, има място за теб!')}
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary rounded-full font-bold text-lg shadow-2xl hover:shadow-white/30 transition-shadow"
                >
                  {t('about.cta_button', 'Свържи се с нас')}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
