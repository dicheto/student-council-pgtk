'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Palette, Save, Eye, Type, Image as ImageIcon, 
  Layout, Sparkles, Check, RefreshCw, Monitor, Smartphone
} from 'lucide-react'

interface DesignSettings {
  // Hero Section
  heroTitle: string
  heroSubtitle: string
  heroTagline: string
  showHeroStats: boolean
  showHeroParticles: boolean
  
  // Colors
  primaryColor: string
  secondaryColor: string
  accentColor: string
  
  // Typography
  headingFont: string
  bodyFont: string
  
  // Sections
  showTimeline: boolean
  showTeamSection: boolean
  showGallery: boolean
  showNewsletter: boolean
  
  // Footer
  footerText: string
  showSocialLinks: boolean
}

const defaultDesign: DesignSettings = {
  heroTitle: 'Ученически Съвет',
  heroSubtitle: 'Вдъхновяваме промяна, изграждаме общност, създаваме бъдеще',
  heroTagline: 'ПГТК ""',
  showHeroStats: true,
  showHeroParticles: true,
  primaryColor: '#0047AB',
  secondaryColor: '#87CEEB',
  accentColor: '#F59E0B',
  headingFont: 'Poppins',
  bodyFont: 'Inter',
  showTimeline: true,
  showTeamSection: true,
  showGallery: true,
  showNewsletter: false,
  footerText: '© 2024 Ученически Съвет - ПГТК. Всички права запазени.',
  showSocialLinks: true,
}

const fontOptions = ['Inter', 'Poppins', 'Roboto', 'Open Sans', 'Montserrat', 'Space Grotesk']

export default function DesignPage() {
  const [design, setDesign] = useState<DesignSettings>(defaultDesign)
  const [activeSection, setActiveSection] = useState('hero')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop')

  const handleSave = async () => {
    setSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const updateDesign = <K extends keyof DesignSettings>(key: K, value: DesignSettings[K]) => {
    setDesign(prev => ({ ...prev, [key]: value }))
  }

  const sections = [
    { id: 'hero', label: 'Hero секция', icon: Layout },
    { id: 'colors', label: 'Цветове', icon: Palette },
    { id: 'typography', label: 'Типография', icon: Type },
    { id: 'sections', label: 'Секции', icon: Sparkles },
    { id: 'footer', label: 'Footer', icon: Layout },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Palette className="w-8 h-8 text-primary" />
            Дизайн на сайта
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Персонализирайте външния вид на вашия сайт
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setDesign(defaultDesign)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Нулиране
          </button>
          <motion.button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-primary to-primary-light text-white rounded-xl font-medium shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all disabled:opacity-50"
            whileHover={{ scale: saving ? 1 : 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {saving ? (
              <motion.div
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            ) : saved ? (
              <Check className="w-5 h-5" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {saving ? 'Запазване...' : saved ? 'Запазено!' : 'Запази'}
          </motion.button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-2"
        >
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  activeSection === section.id
                    ? 'bg-gradient-to-r from-primary to-primary-light text-white shadow-lg shadow-primary/25'
                    : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                {section.label}
              </button>
            )
          })}
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6"
        >
          {/* Hero Section */}
          {activeSection === 'hero' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Hero Секция</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Главно заглавие
                </label>
                <input
                  type="text"
                  value={design.heroTitle}
                  onChange={(e) => updateDesign('heroTitle', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border-0 rounded-xl focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Подзаглавие
                </label>
                <textarea
                  value={design.heroSubtitle}
                  onChange={(e) => updateDesign('heroSubtitle', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border-0 rounded-xl focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tagline (Badge)
                </label>
                <input
                  type="text"
                  value={design.heroTagline}
                  onChange={(e) => updateDesign('heroTagline', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border-0 rounded-xl focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-4">
                <ToggleSetting
                  label="Покажи статистики"
                  description="Показва броячи за членове, събития и т.н."
                  value={design.showHeroStats}
                  onChange={(v) => updateDesign('showHeroStats', v)}
                />
                <ToggleSetting
                  label="Анимирани частици"
                  description="Плаващи елементи в Hero секцията"
                  value={design.showHeroParticles}
                  onChange={(v) => updateDesign('showHeroParticles', v)}
                />
              </div>
            </div>
          )}

          {/* Colors Section */}
          {activeSection === 'colors' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Цветова схема</h2>
              
              <ColorPicker
                label="Основен цвят (Primary)"
                value={design.primaryColor}
                onChange={(v) => updateDesign('primaryColor', v)}
              />
              <ColorPicker
                label="Вторичен цвят (Secondary)"
                value={design.secondaryColor}
                onChange={(v) => updateDesign('secondaryColor', v)}
              />
              <ColorPicker
                label="Акцентен цвят (Accent)"
                value={design.accentColor}
                onChange={(v) => updateDesign('accentColor', v)}
              />

              {/* Preview */}
              <div className="mt-8 p-6 rounded-xl bg-gray-50 dark:bg-slate-700">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">Преглед:</p>
                <div className="flex gap-4">
                  <div 
                    className="w-20 h-20 rounded-xl shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${design.primaryColor}, ${design.secondaryColor})` }}
                  />
                  <div 
                    className="w-20 h-20 rounded-xl shadow-lg"
                    style={{ backgroundColor: design.accentColor }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Typography Section */}
          {activeSection === 'typography' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Типография</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Шрифт за заглавия
                </label>
                <select
                  value={design.headingFont}
                  onChange={(e) => updateDesign('headingFont', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border-0 rounded-xl focus:ring-2 focus:ring-primary"
                >
                  {fontOptions.map(font => (
                    <option key={font} value={font}>{font}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Шрифт за текст
                </label>
                <select
                  value={design.bodyFont}
                  onChange={(e) => updateDesign('bodyFont', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border-0 rounded-xl focus:ring-2 focus:ring-primary"
                >
                  {fontOptions.map(font => (
                    <option key={font} value={font}>{font}</option>
                  ))}
                </select>
              </div>

              {/* Preview */}
              <div className="mt-8 p-6 rounded-xl bg-gray-50 dark:bg-slate-700">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">Преглед:</p>
                <h3 
                  className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
                  style={{ fontFamily: design.headingFont }}
                >
                  Примерно заглавие
                </h3>
                <p 
                  className="text-gray-600 dark:text-gray-400"
                  style={{ fontFamily: design.bodyFont }}
                >
                  Това е примерен текст, който показва избрания шрифт за основния текст на страницата.
                </p>
              </div>
            </div>
          )}

          {/* Sections Toggle */}
          {activeSection === 'sections' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Секции на сайта</h2>
              
              <ToggleSetting
                label="Timeline секция"
                description="Показва хронология на събитията през годината"
                value={design.showTimeline}
                onChange={(v) => updateDesign('showTimeline', v)}
              />
              <ToggleSetting
                label="Екип секция"
                description="Показва членовете на ученическия съвет"
                value={design.showTeamSection}
                onChange={(v) => updateDesign('showTeamSection', v)}
              />
              <ToggleSetting
                label="Галерия секция"
                description="Показва фото галерия от събития"
                value={design.showGallery}
                onChange={(v) => updateDesign('showGallery', v)}
              />
              <ToggleSetting
                label="Newsletter секция"
                description="Форма за абониране за новини (изисква настройка)"
                value={design.showNewsletter}
                onChange={(v) => updateDesign('showNewsletter', v)}
              />
            </div>
          )}

          {/* Footer Section */}
          {activeSection === 'footer' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Footer</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Copyright текст
                </label>
                <input
                  type="text"
                  value={design.footerText}
                  onChange={(e) => updateDesign('footerText', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border-0 rounded-xl focus:ring-2 focus:ring-primary"
                />
              </div>

              <ToggleSetting
                label="Социални мрежи"
                description="Покажи иконки за социални мрежи във footer-а"
                value={design.showSocialLinks}
                onChange={(v) => updateDesign('showSocialLinks', v)}
              />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

function ToggleSetting({ 
  label, 
  description, 
  value, 
  onChange 
}: { 
  label: string
  description: string
  value: boolean
  onChange: (value: boolean) => void 
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-xl">
      <div>
        <p className="font-medium text-gray-900 dark:text-white">{label}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-14 h-8 rounded-full transition-colors ${
          value ? 'bg-primary' : 'bg-gray-300 dark:bg-slate-600'
        }`}
      >
        <motion.div
          className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
          animate={{ left: value ? '1.75rem' : '0.25rem' }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  )
}

function ColorPicker({ 
  label, 
  value, 
  onChange 
}: { 
  label: string
  value: string
  onChange: (value: string) => void 
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-14 h-14 rounded-xl cursor-pointer border-0 p-1 bg-gray-50 dark:bg-slate-700"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-4 py-3 bg-gray-50 dark:bg-slate-700 border-0 rounded-xl focus:ring-2 focus:ring-primary font-mono uppercase"
        />
      </div>
    </div>
  )
}
