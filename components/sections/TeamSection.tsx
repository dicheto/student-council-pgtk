'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  Users, Crown, Star, Heart, 
  Instagram, Mail, Sparkles,
  ChevronRight, Award
} from 'lucide-react'
import { useDictionary } from '@/lib/hooks/useDictionary'

interface TeamMember {
  id: number
  name: string
  role: string
  description: string
  image?: string
  socials?: {
    instagram?: string
    email?: string
  }
  badge?: string
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: 'Председател',
    role: 'Ръководител на съвета',
    description: 'Координира всички дейности и представлява съвета пред училищното ръководство.',
    badge: 'Лидер',
    socials: { email: 'chairman@pgtk.bg' }
  },
  {
    id: 2,
    name: 'Заместник-председател',
    role: 'Организационна дейност',
    description: 'Подпомага председателя и отговаря за организацията на събитията.',
    badge: 'Организатор',
    socials: { email: 'vice@pgtk.bg' }
  },
  {
    id: 3,
    name: 'Секретар',
    role: 'Документация',
    description: 'Води протоколите от заседанията и поддържа документацията на съвета.',
    socials: { email: 'secretary@pgtk.bg' }
  },
  {
    id: 4,
    name: 'PR Мениджър',
    role: 'Комуникации',
    description: 'Отговаря за социалните мрежи и комуникацията с учениците.',
    badge: 'Креативен',
    socials: { instagram: '@pgtk_council', email: 'pr@pgtk.bg' }
  },
  {
    id: 5,
    name: 'Отговорник събития',
    role: 'Координация на събития',
    description: 'Планира и координира всички училищни събития и инициативи.',
    socials: { email: 'events@pgtk.bg' }
  },
  {
    id: 6,
    name: 'Финансов координатор',
    role: 'Бюджет',
    description: 'Управлява бюджета на съвета и финансирането на проектите.',
    socials: { email: 'finance@pgtk.bg' }
  },
]

function MemberCard({ member, index }: { member: TeamMember; index: number }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      <motion.div
        className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 p-6 h-full"
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {/* Gradient overlay on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary-light/5"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        />

        {/* Badge */}
        {member.badge && (
          <motion.div
            className="absolute top-4 right-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 + 0.3, type: 'spring' }}
          >
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-accent/20 to-accent-light/20 text-accent-dark dark:text-accent-light text-xs font-semibold border border-accent/30">
              <Star className="w-3 h-3" />
              {member.badge}
            </span>
          </motion.div>
        )}

        <div className="relative z-10">
          {/* Enhanced Avatar placeholder */}
          <motion.div 
            className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center mb-4 shadow-glow-primary overflow-hidden"
            whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
            animate={{ 
              boxShadow: [
                '0 0 20px rgba(0, 71, 171, 0.4)',
                '0 0 40px rgba(135, 206, 235, 0.6)',
                '0 0 20px rgba(0, 71, 171, 0.4)',
              ],
            }}
            transition={{
              default: { duration: 0.5, type: 'spring' },
              boxShadow: { duration: 2, repeat: Infinity },
            }}
          >
            {member.id === 1 ? (
              <Crown className="w-10 h-10 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] relative z-10" />
            ) : member.id === 4 ? (
              <Sparkles className="w-10 h-10 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] relative z-10" />
            ) : (
              <Users className="w-10 h-10 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] relative z-10" />
            )}
            <motion.div
              className="absolute inset-10 rounded-2xl bg-gradient-to-br from-primary-light to-primary opacity-0 group-hover:opacity-100"
              animate={{ rotate: [0, 360], scale: [2, 2, 2] }}
              transition={{ duration: 3, repeat: Infinity, еase: 'linear' }}
            />
          </motion.div>

          {/* Info */}
          <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white mb-1">
            {member.name}
          </h3>
          <p className="text-primary dark:text-primary-light font-medium text-sm mb-3">
            {member.role}
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
            {member.description}
          </p>

          {/* Social links */}
          {member.socials && (
            <div className="flex items-center gap-2">
              {member.socials.instagram && (
                <motion.a
                  href={`https://instagram.com/${member.socials.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Instagram className="w-4 h-4" />
                </motion.a>
              )}
              {member.socials.email && (
                <motion.a
                  href={`mailto:${member.socials.email}`}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Mail className="w-4 h-4" />
                </motion.a>
              )}
            </div>
          )}
        </div>

        {/* Decorative corner */}
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-primary/5 to-transparent rounded-tl-full" />
      </motion.div>
    </motion.div>
  )
}

export function TeamSection() {
  const { t } = useDictionary('team')
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50 dark:from-slate-900 dark:to-slate-800 overflow-hidden">
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
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-light mb-6 shadow-xl shadow-primary/30"
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
          >
            <Users className="w-10 h-10 text-white" />
          </motion.div>
          
          <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl mb-4 text-gray-900 dark:text-white">
            {t('title', 'Нашият')}{' '}
            <span className="text-gradient">{t('title_highlight', 'Екип')}</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('subtitle', 'Запознайте се с членовете на ученическия съвет, които работят за вас')}
          </p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {teamMembers.map((member, index) => (
            <MemberCard key={member.id} member={member} index={index} />
          ))}
        </div>

        {/* Join CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-3xl bg-gradient-to-r from-primary/10 to-primary-light/10 dark:from-primary/20 dark:to-primary-light/20 border border-primary/20">
            <div className="flex items-center gap-3">
              <motion.div
                className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary-light"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Heart className="w-6 h-6 text-white" />
              </motion.div>
              <div className="text-left">
                <p className="font-bold text-gray-900 dark:text-white">
                  {t('join_title', 'Искаш да се присъединиш?')}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('join_subtitle', 'Винаги търсим нови членове с идеи!')}
                </p>
              </div>
            </div>
            <motion.a
              href="/contact"
              className="relative inline-flex items-center gap-2 px-6 py-3 btn-glow text-white rounded-xl font-semibold overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">{t('join_btn', 'Свържи се')}</span>
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="relative z-10"
              >
                <ChevronRight className="w-4 h-4" />
              </motion.div>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full"
                transition={{ duration: 0.6 }}
              />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
