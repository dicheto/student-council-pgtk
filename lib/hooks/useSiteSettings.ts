'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface SiteSettings {
  logoUrl: string | null
  siteNameBg: string
  siteNameEn: string
  siteDescriptionBg: string
  siteDescriptionEn: string
  schoolNameBg: string
  schoolNameEn: string
  email: string
  phone: string
  facebookUrl: string
  instagramUrl: string
  twitterUrl: string
}

const defaultSettings: SiteSettings = {
  logoUrl: null,
  siteNameBg: 'Ученически Съвет',
  siteNameEn: 'Student Council',
  siteDescriptionBg: 'Вдъхновяваме промяна, изграждаме общност, създаваме бъдеще.',
  siteDescriptionEn: 'Inspiring change, building community, creating the future.',
  schoolNameBg: 'ПГТК ""',
  schoolNameEn: 'Vocational High School of Tourism and Culinary Arts "Georgi Izmirliev"',
  email: 'contact@pgtk.bg',
  phone: '+359 XXX XXX XXX',
  facebookUrl: '',
  instagramUrl: '',
  twitterUrl: '',
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('key, value')
          .in('key', [
            'logo_url',
            'site_name_bg',
            'site_name_en',
            'site_description_bg',
            'site_description_en',
            'school_name_bg',
            'school_name_en',
            'contact_email',
            'contact_phone',
            'social_facebook',
            'social_instagram',
            'social_twitter',
          ])

        if (error) {
          console.error('Error loading site settings:', error)
          return
        }

        const newSettings = { ...defaultSettings }

        if (data) {
          data.forEach((item: { key: string; value: any }) => {
            switch (item.key) {
              case 'logo_url':
                newSettings.logoUrl = item.value || null
                break
              case 'site_name_bg':
                newSettings.siteNameBg = item.value || defaultSettings.siteNameBg
                break
              case 'site_name_en':
                newSettings.siteNameEn = item.value || defaultSettings.siteNameEn
                break
              case 'site_description_bg':
                newSettings.siteDescriptionBg = item.value || defaultSettings.siteDescriptionBg
                break
              case 'site_description_en':
                newSettings.siteDescriptionEn = item.value || defaultSettings.siteDescriptionEn
                break
              case 'school_name_bg':
                newSettings.schoolNameBg = item.value || defaultSettings.schoolNameBg
                break
              case 'school_name_en':
                newSettings.schoolNameEn = item.value || defaultSettings.schoolNameEn
                break
              case 'contact_email':
                newSettings.email = item.value || defaultSettings.email
                break
              case 'contact_phone':
                newSettings.phone = item.value || defaultSettings.phone
                break
              case 'social_facebook':
                newSettings.facebookUrl = item.value || defaultSettings.facebookUrl
                break
              case 'social_instagram':
                newSettings.instagramUrl = item.value || defaultSettings.instagramUrl
                break
              case 'social_twitter':
                newSettings.twitterUrl = item.value || defaultSettings.twitterUrl
                break
            }
          })
        }

        setSettings(newSettings)
      } catch (error: any) {
        if (error?.name !== 'AbortError' && !error?.message?.includes('aborted')) {
          console.error('Error loading site settings:', error)
        }
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [supabase])

  return { settings, loading }
}
