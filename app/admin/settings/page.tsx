'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings, Save, Globe, Palette, Bell, Shield, 
  Mail, Phone, MapPin, Facebook, Instagram, Twitter,
  Image as ImageIcon, Type, Sparkles, Check, AlertCircle, Loader2
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface SiteSettings {
  // General (localized)
  siteNameBg: string
  siteNameEn: string
  siteDescriptionBg: string
  siteDescriptionEn: string
  schoolNameBg: string
  schoolNameEn: string
  schoolAddressBg: string
  schoolAddressEn: string
  
  // Contact
  email: string
  phone: string
  
  // Social
  facebookUrl: string
  instagramUrl: string
  twitterUrl: string
  
  // Design / Branding
  primaryColor: string
  accentColor: string
  darkModeDefault: boolean
  logoUrl: string
  
  // Features
  enableDiscord: boolean
  enableNewsletter: boolean
  enableComments: boolean
}

const defaultSettings: SiteSettings = {
  // General
  siteNameBg: 'Ученически Съвет',
  siteNameEn: 'Student Council',
  siteDescriptionBg: 'Вдъхновяваме промяна, изграждаме общност, създаваме бъдеще.',
  siteDescriptionEn: 'Inspiring change, building community, creating the future.',
  schoolNameBg: 'ПГТК \"\"',
  schoolNameEn: 'Vocational High School of Tourism and Culinary Arts \"Georgi Izmirliev\"',
  schoolAddressBg: 'България',
  schoolAddressEn: 'Bulgaria',
  
  // Contact
  email: 'contact@pgtk.bg',
  phone: '+359 XXX XXX XXX',
  
  // Social
  facebookUrl: '',
  instagramUrl: '',
  twitterUrl: '',
  
  // Design
  primaryColor: '#0047AB',
  accentColor: '#F59E0B',
  darkModeDefault: false,
  logoUrl: '',
  
  // Features
  enableDiscord: true,
  enableNewsletter: false,
  enableComments: false,
}

const settingKeyMap: Record<keyof SiteSettings, string> = {
  // General
  siteNameBg: 'site_name_bg',
  siteNameEn: 'site_name_en',
  siteDescriptionBg: 'site_description_bg',
  siteDescriptionEn: 'site_description_en',
  schoolNameBg: 'school_name_bg',
  schoolNameEn: 'school_name_en',
  schoolAddressBg: 'school_address_bg',
  schoolAddressEn: 'school_address_en',
  // Contact
  email: 'contact_email',
  phone: 'contact_phone',
  // Social
  facebookUrl: 'social_facebook',
  instagramUrl: 'social_instagram',
  twitterUrl: 'social_twitter',
  // Design
  primaryColor: 'primary_color',
  accentColor: 'accent_color',
  darkModeDefault: 'dark_mode_default',
  logoUrl: 'logo_url',
  // Features
  enableDiscord: 'enable_discord',
  enableNewsletter: 'enable_newsletter',
  enableComments: 'enable_comments',
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('general')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value')

      if (error) {
        console.log('Settings table might not exist yet:', error)
        return
      }

      if (data && data.length > 0) {
        const newSettings = { ...defaultSettings }
        
        data.forEach((item: { key: string; value: any }) => {
          const frontendKey = Object.entries(settingKeyMap).find(([_, v]) => v === item.key)?.[0] as keyof SiteSettings | undefined
          if (frontendKey) {
            (newSettings as any)[frontendKey] = item.value
          }
        })

        setSettings(newSettings)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Upsert all settings
      const settingsToSave = Object.entries(settings).map(([key, value]) => ({
        key: settingKeyMap[key as keyof SiteSettings],
        value,
      }))

      for (const setting of settingsToSave) {
        const { error } = await supabase
          .from('site_settings')
          .upsert({ key: setting.key, value: setting.value }, { onConflict: 'key' })

        if (error) throw error
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Грешка при запазване. Уверете се, че таблицата site_settings съществува.')
    } finally {
      setSaving(false)
    }
  }

  const updateSetting = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const tabs = [
    { id: 'general', label: 'Преводи и основни данни', icon: Type },
    { id: 'contact', label: 'Контакти', icon: Mail },
    { id: 'social', label: 'Социални мрежи', icon: Globe },
    { id: 'design', label: 'Дизайн и лого', icon: Palette },
    { id: 'features', label: 'Функции', icon: Sparkles },
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Настройки на сайта
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Управлявайте преводите, брандинга и общите настройки на сайта
          </p>
        </div>
        <motion.button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-light text-white rounded-xl font-medium shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all disabled:opacity-50"
          whileHover={{ scale: saving ? 1 : 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {saving ? (
            <>
              <motion.div
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              Запазване...
            </>
          ) : saved ? (
            <>
              <Check className="w-5 h-5" />
              Запазено!
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Запази промените
            </>
          )}
        </motion.button>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex overflow-x-auto gap-2 pb-2"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6"
      >
        {/* General & Translations Settings */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Име на сайта (BG)
              </label>
              <input
                type="text"
                value={settings.siteNameBg}
                onChange={(e) => updateSetting('siteNameBg', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border-0 rounded-xl focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Име на сайта (EN)
              </label>
              <input
                type="text"
                value={settings.siteNameEn}
                onChange={(e) => updateSetting('siteNameEn', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border-0 rounded-xl focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Описание на сайта (BG)
              </label>
              <textarea
                value={settings.siteDescriptionBg}
                onChange={(e) => updateSetting('siteDescriptionBg', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border-0 rounded-xl focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Описание на сайта (EN)
              </label>
              <textarea
                value={settings.siteDescriptionEn}
                onChange={(e) => updateSetting('siteDescriptionEn', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border-0 rounded-xl focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Име на училището (BG)
              </label>
              <input
                type="text"
                value={settings.schoolNameBg}
                onChange={(e) => updateSetting('schoolNameBg', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border-0 rounded-xl focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Име на училището (EN)
              </label>
              <input
                type="text"
                value={settings.schoolNameEn}
                onChange={(e) => updateSetting('schoolNameEn', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border-0 rounded-xl focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Адрес (BG)
              </label>
              <input
                type="text"
                value={settings.schoolAddressBg}
                onChange={(e) => updateSetting('schoolAddressBg', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border-0 rounded-xl focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Адрес (EN)
              </label>
              <input
                type="text"
                value={settings.schoolAddressEn}
                onChange={(e) => updateSetting('schoolAddressEn', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border-0 rounded-xl focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        )}

        {/* Contact Settings */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email адрес
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => updateSetting('email', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border-0 rounded-xl focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Телефон
              </label>
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) => updateSetting('phone', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border-0 rounded-xl focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        )}

        {/* Social Settings */}
        {activeTab === 'social' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Facebook className="w-4 h-4 inline mr-2" />
                Facebook URL
              </label>
              <input
                type="url"
                value={settings.facebookUrl}
                onChange={(e) => updateSetting('facebookUrl', e.target.value)}
                placeholder="https://facebook.com/..."
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border-0 rounded-xl focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Instagram className="w-4 h-4 inline mr-2" />
                Instagram URL
              </label>
              <input
                type="url"
                value={settings.instagramUrl}
                onChange={(e) => updateSetting('instagramUrl', e.target.value)}
                placeholder="https://instagram.com/..."
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border-0 rounded-xl focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Twitter className="w-4 h-4 inline mr-2" />
                Twitter URL
              </label>
              <input
                type="url"
                value={settings.twitterUrl}
                onChange={(e) => updateSetting('twitterUrl', e.target.value)}
                placeholder="https://twitter.com/..."
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border-0 rounded-xl focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        )}

        {/* Design & Logo Settings */}
        {activeTab === 'design' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Основен цвят
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => updateSetting('primaryColor', e.target.value)}
                    className="w-12 h-12 rounded-xl cursor-pointer border-0"
                  />
                  <input
                    type="text"
                    value={settings.primaryColor}
                    onChange={(e) => updateSetting('primaryColor', e.target.value)}
                    className="flex-1 px-4 py-3 bg-gray-50 dark:bg-slate-700 border-0 rounded-xl focus:ring-2 focus:ring-primary font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Акцентен цвят
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.accentColor}
                    onChange={(e) => updateSetting('accentColor', e.target.value)}
                    className="w-12 h-12 rounded-xl cursor-pointer border-0"
                  />
                  <input
                    type="text"
                    value={settings.accentColor}
                    onChange={(e) => updateSetting('accentColor', e.target.value)}
                    className="flex-1 px-4 py-3 bg-gray-50 dark:bg-slate-700 border-0 rounded-xl focus:ring-2 focus:ring-primary font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Logo upload */}
            <div className="border-t border-gray-200 dark:border-slate-700 pt-6 mt-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Лого на съвета
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Качи официалното лого на ученическия съвет. То ще се показва в горния header и в admin панела.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center px-4 py-2 rounded-xl bg-gray-100 dark:bg-slate-700 text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    <span>Избери файл</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        try {
                          const formData = new FormData()
                          formData.append('file', file)
                          const res = await fetch('/api/upload', {
                            method: 'POST',
                            body: formData,
                          })
                          if (!res.ok) {
                            const err = await res.json().catch(() => null)
                            throw new Error(err?.error || 'Грешка при качване на лого')
                          }
                          const data = await res.json()
                          updateSetting('logoUrl', data.url)
                        } catch (err: any) {
                          console.error('Logo upload error:', err)
                          alert(err?.message || 'Грешка при качване на лого')
                        }
                      }}
                    />
                  </label>
                </div>
                {settings.logoUrl && (
                  <div className="flex items-center gap-3">
                    <img
                      src={settings.logoUrl}
                      alt="Лого на съвета"
                      className="h-12 w-12 rounded-xl object-cover border border-gray-200 dark:border-slate-700 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => updateSetting('logoUrl', '')}
                      className="text-xs text-red-500 hover:text-red-600"
                    >
                      Премахни логото
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-xl">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Тъмен режим по подразбиране</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Показвай сайта в тъмен режим при първо посещение</p>
              </div>
              <button
                onClick={() => updateSetting('darkModeDefault', !settings.darkModeDefault)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  settings.darkModeDefault ? 'bg-primary' : 'bg-gray-300 dark:bg-slate-600'
                }`}
              >
                <motion.div
                  className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                  animate={{ left: settings.darkModeDefault ? '1.75rem' : '0.25rem' }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
          </div>
        )}

        {/* Features Settings */}
        {activeTab === 'features' && (
          <div className="space-y-4">
            {[
              { key: 'enableDiscord' as const, label: 'Discord интеграция', desc: 'Публикувай новини в Discord автоматично' },
              { key: 'enableNewsletter' as const, label: 'Newsletter', desc: 'Позволи на потребители да се абонират за новини' },
              { key: 'enableComments' as const, label: 'Коментари', desc: 'Позволи коментари под новините' },
            ].map((feature) => (
              <div key={feature.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{feature.label}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{feature.desc}</p>
                </div>
                <button
                  onClick={() => updateSetting(feature.key, !settings[feature.key])}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    settings[feature.key] ? 'bg-primary' : 'bg-gray-300 dark:bg-slate-600'
                  }`}
                >
                  <motion.div
                    className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                    animate={{ left: settings[feature.key] ? '1.75rem' : '0.25rem' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Info Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-start gap-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl"
      >
        <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-amber-800 dark:text-amber-200">Забележка</p>
          <p className="text-sm text-amber-700 dark:text-amber-300">
            В режим на разработка (без Supabase) настройките се запазват само локално и ще се изгубят при презареждане.
            За постоянно съхранение, настройте Supabase база данни.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
