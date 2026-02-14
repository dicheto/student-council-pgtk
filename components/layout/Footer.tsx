'use client'

import { motion } from 'framer-motion'
import { AnimatedLogo } from '@/components/animations/AnimatedLogo'
import { 
  Facebook, Instagram, Mail, MapPin, Phone, 
  Clock, Heart, ExternalLink, ChevronRight, Sparkles
} from 'lucide-react'
import Link from 'next/link'
import { useSiteSettings } from '@/lib/hooks/useSiteSettings'

const quickLinks = [
  { label: 'Начало', href: '/' },
  { label: 'За нас', href: '/about' },
  { label: 'Събития', href: '/events' },
  { label: 'Новини', href: '/news' },
  { label: 'Галерия', href: '/gallery' },
  { label: 'Контакти', href: '/contact' },
]

const resources = [
  { label: 'RSS Feed', href: '/api/rss' },
  { label: 'Календар', href: '/events' },
  { label: 'Админ панел', href: '/admin' },
]

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook', color: 'hover:bg-blue-600' },
  { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:bg-pink-600' },
  { icon: Mail, href: 'mailto:contact@pgtk.bg', label: 'Email', color: 'hover:bg-primary' },
]

export function Footer() {
  const currentYear = new Date().getFullYear()
  const { settings } = useSiteSettings()

  return (
    <footer className="relative bg-slate-900 text-gray-300 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-800/50 to-slate-900" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-light/5 rounded-full blur-[100px]" />

      {/* Main footer content */}
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <motion.div
              className="flex items-center gap-3 mb-6"
              whileHover={{ scale: 1.02 }}
            >
              <AnimatedLogo size={50} animated={false} logoUrl={settings.logoUrl} />
              <div>
                <span className="font-display font-bold text-xl text-white block">
                  {settings.siteNameBg}
                </span>
                <span className="text-xs text-gray-500">ПГТК</span>
              </div>
            </motion.div>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Вдъхновяваме промяна, изграждаме общност, създаваме бъдеще. Заедно правим училището по-добро място!
            </p>
            
            {/* Social links */}
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label, color }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  className={`w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-gray-400 ${color} hover:text-white hover:border-transparent transition-all`}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-bold text-white mb-6 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary-light" />
              Бързи връзки
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>
                    <motion.span 
                      className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm cursor-pointer group"
                      whileHover={{ x: 4 }}
                    >
                      <ChevronRight className="w-3 h-3 text-primary-light opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                    </motion.span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-display font-bold text-white mb-6 flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-primary-light" />
              Ресурси
            </h3>
            <ul className="space-y-3">
              {resources.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>
                    <motion.span 
                      className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm cursor-pointer group"
                      whileHover={{ x: 4 }}
                    >
                      <ChevronRight className="w-3 h-3 text-primary-light opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                    </motion.span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display font-bold text-white mb-6 flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary-light" />
              Контакти
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-light flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">
                  ул. Стефан Младенов 1, Студентски град, София<br />
                  България
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary-light flex-shrink-0" />
                <a href="mailto:contact@pgtk.bg" className="text-gray-400 hover:text-white transition-colors text-sm">
                  studentcouncil@tcom-sf.org
                </a>
              </li>
              
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-8" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {currentYear} Ученически Съвет - ПГТК. Всички права запазени.
          </p>
          <p className="text-gray-500 text-sm flex items-center gap-1">
            Направено с <Heart className="w-4 h-4 text-red-500 fill-red-500" /> от Dicheto
          </p>
        </div>
      </div>
    </footer>
  )
}
