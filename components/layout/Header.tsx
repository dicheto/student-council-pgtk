'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Globe, Moon, Sun, LogIn, LogOut, User, Accessibility } from 'lucide-react'
import { AnimatedLogo } from '@/components/animations/AnimatedLogo'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useSiteSettings } from '@/lib/hooks/useSiteSettings'
import { useLanguage } from '@/lib/contexts/LanguageContext'
import { AccessibilityMobileContent } from '@/components/ui/AccessibilityMobileContent'
import { useAccessibilityMenu } from '@/lib/contexts/AccessibilityContext'

const navItems = [
  { label: 'Начало', href: '/', key: 'home' },
  { label: 'За нас', href: '#about', key: 'about' },
  { label: 'Събития', href: '/events', key: 'events' },
  { label: 'Новини', href: '#news', key: 'news' },
  { label: 'Галерия', href: '#gallery', key: 'gallery' },
  { label: 'Контакти', href: '#contact', key: 'contact' },
]

type Locale = 'bg' | 'en'

const navLabels: Record<Locale, Record<string, string>> = {
  bg: {
    home: 'Начало',
    about: 'За нас',
    events: 'Събития',
    news: 'Новини',
    gallery: 'Галерия',
    contact: 'Контакти',
  },
  en: {
    home: 'Home',
    about: 'About',
    events: 'Events',
    news: 'News',
    gallery: 'Gallery',
    contact: 'Contact',
  },
}

export function Header() {
  const [mounted, setMounted] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const { resolvedTheme, setTheme } = useTheme()
  const router = useRouter()
  const supabase = createClient()
  const { settings } = useSiteSettings()
  const { language, toggleLanguage } = useLanguage()
  const { isOpen, setIsOpen } = useAccessibilityMenu()

  useEffect(() => {
    setMounted(true)

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)

    let isMounted = true

    const initAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (isMounted && user) {
          setUser(user)
          
          // Try to fetch profile, but handle case where it doesn't exist
          const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle()
          
          if (error) {
            // Log error but don't fail - profile might not exist yet
            if (error.code && error.code !== 'PGRST116') {
              console.error('Profile fetch error:', error)
            }
            if (isMounted) setProfile(null)
          } else if (data) {
            if (isMounted) setProfile(data)
          } else {
            // Profile doesn't exist - try to create it
            try {
              const { data: newProfile, error: createError } = await supabase
                .from('user_profiles')
                .insert({
                  id: user.id,
                  username: user.email?.split('@')[0] || `user_${user.id.slice(0, 8)}`,
                  full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
                  role: 'user',
                  language: 'bg',
                })
                .select()
                .single()
              
              if (!createError && newProfile && isMounted) {
                setProfile(newProfile)
              } else if (isMounted) {
                setProfile(null)
              }
            } catch (createErr) {
              // If creation fails, just set profile to null
              console.error('Profile creation error:', createErr)
              if (isMounted) setProfile(null)
            }
          }
        }
      } catch (error: any) {
        // Ignore AbortError - it's normal when component unmounts
        if (error?.name === 'AbortError' || error?.message?.includes('aborted')) {
          return
        }
        console.error('Auth error:', error)
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (isMounted) {
          setUser(session?.user ?? null)
        }
        if (session?.user && isMounted) {
          try {
            const { data, error } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle()
            
            if (error) {
              // Log error but don't fail - profile might not exist yet
              if (error.code && error.code !== 'PGRST116') {
                console.error('Profile fetch error:', error)
              }
              if (isMounted) setProfile(null)
            } else if (data) {
              if (isMounted) setProfile(data)
            } else {
              // Profile doesn't exist - try to create it
              try {
                const { data: newProfile, error: createError } = await supabase
                  .from('user_profiles')
                  .insert({
                    id: session.user.id,
                    username: session.user.email?.split('@')[0] || `user_${session.user.id.slice(0, 8)}`,
                    full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
                    role: 'user',
                    language: 'bg',
                  })
                  .select()
                  .single()
                
                if (!createError && newProfile && isMounted) {
                  setProfile(newProfile)
                } else if (isMounted) {
                  setProfile(null)
                }
              } catch (createErr: any) {
                // Ignore AbortError - it's normal when component unmounts
                if (createErr?.name === 'AbortError' || createErr?.message?.includes('aborted')) {
                  return
                }
                // If creation fails, just set profile to null
                console.error('Profile creation error:', createErr)
                if (isMounted) setProfile(null)
              }
            }
          } catch (error: any) {
            // Ignore AbortError - it's normal when component unmounts
            if (error?.name === 'AbortError' || error?.message?.includes('aborted')) {
              return
            }
            console.error('Profile fetch error:', error)
            if (isMounted) setProfile(null)
          }
        } else if (isMounted) {
          setProfile(null)
        }
      }
    )

    return () => {
      isMounted = false
      window.removeEventListener('scroll', handleScroll)
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [])

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  const currentTheme = resolvedTheme || 'light'


  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    router.push('/')
    router.refresh()
  }

  if (!mounted) return null

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.21, 0.61, 0.35, 1] }}
      className={cn(
        'pointer-events-none fixed top-0 left-0 right-0 z-50 flex justify-center gpu-accelerated'
      )}
    >
      <motion.nav
        className="pointer-events-auto mt-3 w-full max-w-6xl px-4 sm:px-6 lg:px-8"
        animate={{
          y: isScrolled ? 8 : 16,
          scale: isScrolled ? 0.98 : 1,
        }}
        transition={{ duration: 0.4, ease: [0.21, 0.61, 0.35, 1] }}
      >
        <AnimatePresence>
          <motion.div
            layout
            className={cn(
              'rounded-2xl overflow-hidden',
              'apple-glass shadow-lg relative'
            )}
            animate={{
              backdropFilter: isScrolled ? 'blur(20px)' : 'blur(24px)',
            }}
            transition={{ duration: 0.4 }}
          >
            {/* Shimmer effect on hover */}
            <motion.div
              className="absolute inset-0 opacity-0 hover:opacity-100 pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
              }}
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
                ease: 'linear',
              }}
            />

            {/* Main Header Content */}
            <div className="relative flex items-center justify-between px-4 sm:px-6 py-3">
              {/* Logo */}
              <motion.a
                href="/"
                className="flex items-center space-x-3 group flex-shrink-0"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <AnimatedLogo size={50} animated={true} logoUrl={settings.logoUrl} />
                <span className="font-display font-bold text-xl text-primary dark:text-primary-light hidden sm:block">
                  {language === 'bg' ? settings.siteNameBg : settings.siteNameEn}
                </span>
              </motion.a>

              {/* Desktop Navigation */}
              <div className="hidden items-center space-x-1 lg:flex relative z-10">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.key}
                    href={item.href}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors relative group"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08, duration: 0.5, ease: [0.21, 0.61, 0.35, 1] }}
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {navLabels[language][item.key] || item.label}
                    <motion.span
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary dark:bg-primary-light origin-left"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3, ease: [0.21, 0.61, 0.35, 1] }}
                    />
                  </motion.a>
                ))}
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-1 sm:space-x-2 relative z-10 flex-shrink-0">
                {/* Auth Buttons */}
                {user ? (
                  <>
                    {(profile?.role === 'admin' || profile?.role === 'editor') && (
                      <motion.a
                        href="/admin"
                        className="hidden lg:flex items-center space-x-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <User className="w-4 h-4" />
                        <span className="text-sm font-medium">Admin</span>
                      </motion.a>
                    )}
                    <motion.button
                      onClick={handleLogout}
                      className="hidden lg:flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-medium">Изход</span>
                    </motion.button>
                  </>
                ) : (
                  <motion.a
                    href="/login"
                    className="hidden lg:flex items-center space-x-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="text-sm font-medium">Вход</span>
                  </motion.a>
                )}

                {/* Accessibility Menu Button - Desktop */}
                <motion.button
                  onClick={() => setIsOpen(!isOpen)}
                  className="hidden lg:block rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Accessibility settings"
                >
                  <Accessibility className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </motion.button>

                {/* Accessibility Menu - Mobile Button */}
                <motion.button
                  onClick={() => setIsAccessibilityOpen(!isAccessibilityOpen)}
                  className="lg:hidden rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Accessibility settings"
                >
                  <Accessibility className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </motion.button>

                {/* Language Toggle */}
                <motion.button
                  onClick={() => {
                    toggleLanguage()
                    setTimeout(() => router.refresh(), 100)
                  }}
                  className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Toggle language"
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  >
                    <Globe className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </motion.div>
                </motion.button>

                {/* Theme Toggle */}
                <motion.button
                  onClick={toggleTheme}
                  className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
                  whileHover={{ scale: 1.1, rotate: currentTheme === 'dark' ? 180 : 0 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Toggle theme"
                >
                  <AnimatePresence mode="wait">
                    {currentTheme === 'dark' ? (
                      <motion.div
                        key="sun"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Sun className="w-5 h-5 text-yellow-500" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="moon"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Moon className="w-5 h-5 text-gray-700" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors lg:hidden"
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Menu - Integrated into header */}
            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="lg:hidden border-t border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden"
                >
                  <div className="px-4 sm:px-6 py-4 space-y-2">
                    {/* Mobile Navigation */}
                    {navItems.map((item, index) => (
                      <motion.a
                        key={item.key}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-4 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors font-medium text-sm"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        {navLabels[language][item.key] || item.label}
                      </motion.a>
                    ))}

                    <div className="my-2 border-t border-white/10" />

                    {/* Mobile Auth Buttons */}
                    {user ? (
                      <>
                        {(profile?.role === 'admin' || profile?.role === 'editor') && (
                          <motion.a
                            href="/admin"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-primary/90 text-white hover:bg-primary transition-colors font-medium text-sm"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.25 }}
                          >
                            <User className="w-4 h-4" />
                            <span>Admin Panel</span>
                          </motion.a>
                        )}
                        <motion.button
                          onClick={() => {
                            handleLogout()
                            setIsMobileMenuOpen(false)
                          }}
                          className="flex items-center space-x-2 w-full px-4 py-2.5 rounded-lg bg-red-500/90 text-white hover:bg-red-600 transition-colors font-medium text-sm"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Изход</span>
                        </motion.button>
                      </>
                    ) : (
                      <motion.a
                        href="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-primary/90 text-white hover:bg-primary transition-colors font-medium text-sm"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 }}
                      >
                        <LogIn className="w-4 h-4" />
                        <span>Вход</span>
                      </motion.a>
                    )}
                  </div>

                  {/* Mobile Accessibility Panel */}
                  <AnimatePresence>
                    {isAccessibilityOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden"
                      >
                        <div className="px-4 sm:px-6 py-4">
                          <div className="flex items-center gap-2 mb-4">
                            <Accessibility className="w-5 h-5 text-primary" />
                            <h3 className="font-bold text-gray-900 dark:text-white">Достъпност</h3>
                          </div>
                          
                          {/* Accessibility Content Component */}
                          <AccessibilityMobileContent />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </motion.nav>
    </motion.header>
  )
}
