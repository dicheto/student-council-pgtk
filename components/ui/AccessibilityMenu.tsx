'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAccessibilityMenu } from '@/lib/contexts/AccessibilityContext'
import { 
  Accessibility, 
  X, 
  Type, 
  ZoomIn, 
  ZoomOut,
  Eye,
  EyeOff,
  Contrast,
  Minus,
  Plus,
  RotateCcw,
  Palette,
  Square
} from 'lucide-react'

interface AccessibilitySettings {
  fontSize: number
  letterSpacing: number
  lineHeight: number
  contrast: 'normal' | 'high' | 'dark'
  grayscale: boolean
  highlightLinks: boolean
  reducedMotion: boolean
  cursorSize: 'normal' | 'large' | 'extra-large'
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 100,
  letterSpacing: 0,
  lineHeight: 1.5,
  contrast: 'normal',
  grayscale: false,
  highlightLinks: false,
  reducedMotion: false,
  cursorSize: 'normal',
}

export function AccessibilityMenu({ isMobile = false }: { isMobile?: boolean }) {
  const { isOpen, setIsOpen } = useAccessibilityMenu()
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings)
  const [mounted, setMounted] = useState(false)

  // Check if component is mounted (for portal)
  useEffect(() => {
    setMounted(true)
    
    // Create portal root if it doesn't exist
    if (!document.getElementById('accessibility-portal')) {
      const portalRoot = document.createElement('div')
      portalRoot.id = 'accessibility-portal'
      portalRoot.style.position = 'relative'
      portalRoot.style.zIndex = '9999'
      document.body.appendChild(portalRoot)
    }
  }, [])

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('accessibility-settings')
    if (saved) {
      try {
        setSettings(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load accessibility settings')
      }
    }
  }, [])

  // Apply settings to document
  useEffect(() => {
    const root = document.documentElement
    
    // Font size
    root.style.fontSize = `${settings.fontSize}%`
    
    // Letter spacing
    if (settings.letterSpacing !== 0) {
      root.style.setProperty('--letter-spacing', `${settings.letterSpacing}px`)
      document.body.style.letterSpacing = `${settings.letterSpacing}px`
    } else {
      root.style.removeProperty('--letter-spacing')
      document.body.style.letterSpacing = ''
    }
    
    // Line height
    if (settings.lineHeight !== 1.5) {
      document.body.style.lineHeight = settings.lineHeight.toString()
    } else {
      document.body.style.lineHeight = ''
    }
    
    // Contrast & Grayscale - apply to main content wrapper, not body (to avoid stacking context issues)
    const mainContent = document.querySelector('main') || document.body
    
    // Build filter string
    let filters: string[] = []
    
    if (settings.grayscale) {
      filters.push('grayscale(100%)')
    }
    
    if (settings.contrast === 'high') {
      filters.push('contrast(1.5)')
    } else if (settings.contrast === 'dark') {
      filters.push('contrast(2) brightness(0.8)')
    }
    
    // Apply combined filters
    if (filters.length > 0) {
      mainContent.style.filter = filters.join(' ')
    } else {
      mainContent.style.filter = ''
    }
    
    // Remove old body classes (cleanup)
    document.body.classList.remove('high-contrast', 'dark-contrast')
    
    // Highlight links
    if (settings.highlightLinks) {
      document.body.classList.add('highlight-links')
    } else {
      document.body.classList.remove('highlight-links')
    }
    
    // Reduced motion
    if (settings.reducedMotion) {
      document.body.classList.add('reduce-motion')
    } else {
      document.body.classList.remove('reduce-motion')
    }
    
    // Cursor size
    document.body.classList.remove('cursor-large', 'cursor-extra-large')
    if (settings.cursorSize === 'large') {
      document.body.classList.add('cursor-large')
    } else if (settings.cursorSize === 'extra-large') {
      document.body.classList.add('cursor-extra-large')
    }
    
    // Save to localStorage
    localStorage.setItem('accessibility-settings', JSON.stringify(settings))
  }, [settings])

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
    localStorage.removeItem('accessibility-settings')
  }

  // Common content component
  const MenuContent = () => (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Font Size */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
            <label className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">
              Размер на текста
            </label>
          </div>
          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            {settings.fontSize}%
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => updateSetting('fontSize', Math.max(75, settings.fontSize - 10))}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Decrease font size"
          >
            <ZoomOut className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
          <input
            type="range"
            min="75"
            max="150"
            step="5"
            value={settings.fontSize}
            onChange={(e) => updateSetting('fontSize', parseInt(e.target.value))}
            className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <button
            onClick={() => updateSetting('fontSize', Math.min(150, settings.fontSize + 10))}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Increase font size"
          >
            <ZoomIn className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {/* Letter Spacing */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Minus className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
            <label className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">
              Разстояние между буквите
            </label>
          </div>
          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            {settings.letterSpacing}px
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="5"
          step="0.5"
          value={settings.letterSpacing}
          onChange={(e) => updateSetting('letterSpacing', parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
        />
      </div>

      {/* Line Height */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
            <label className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">
              Височина на реда
            </label>
          </div>
          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            {settings.lineHeight.toFixed(1)}
          </span>
        </div>
        <input
          type="range"
          min="1.2"
          max="2.5"
          step="0.1"
          value={settings.lineHeight}
          onChange={(e) => updateSetting('lineHeight', parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
        />
      </div>

      {/* Contrast */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Contrast className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
          <label className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">
            Контраст
          </label>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {(['normal', 'high', 'dark'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => updateSetting('contrast', mode)}
              className={`p-2 sm:p-3 rounded-lg border-2 transition-all text-xs sm:text-sm ${
                settings.contrast === mode
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="font-medium text-center">
                {mode === 'normal' && 'Нормален'}
                {mode === 'high' && 'Висок'}
                {mode === 'dark' && 'Тъмен'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Toggle Options */}
      <div className="space-y-2 pt-3 border-t border-gray-200 dark:border-gray-800">
        {/* Grayscale */}
        <button
          onClick={() => updateSetting('grayscale', !settings.grayscale)}
          className={`w-full flex items-center justify-between p-3 sm:p-4 rounded-lg border-2 transition-all ${
            settings.grayscale
              ? 'border-primary bg-primary/10'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <Palette className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium text-sm sm:text-base">Монохромен режим</span>
          </div>
          <div className={`w-8 h-4 sm:w-10 sm:h-6 rounded-full transition-colors ${
            settings.grayscale ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'
          }`}>
            <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-white mt-0.5 sm:mt-1 transition-transform ${
              settings.grayscale ? 'translate-x-4 sm:translate-x-5' : 'translate-x-0.5 sm:translate-x-1'
            }`} />
          </div>
        </button>

        {/* Highlight Links */}
        <button
          onClick={() => updateSetting('highlightLinks', !settings.highlightLinks)}
          className={`w-full flex items-center justify-between p-3 sm:p-4 rounded-lg border-2 transition-all ${
            settings.highlightLinks
              ? 'border-primary bg-primary/10'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium text-sm sm:text-base">Подчертай връзките</span>
          </div>
          <div className={`w-8 h-4 sm:w-10 sm:h-6 rounded-full transition-colors ${
            settings.highlightLinks ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'
          }`}>
            <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-white mt-0.5 sm:mt-1 transition-transform ${
              settings.highlightLinks ? 'translate-x-4 sm:translate-x-5' : 'translate-x-0.5 sm:translate-x-1'
            }`} />
          </div>
        </button>

        {/* Reduced Motion */}
        <button
          onClick={() => updateSetting('reducedMotion', !settings.reducedMotion)}
          className={`w-full flex items-center justify-between p-3 sm:p-4 rounded-lg border-2 transition-all ${
            settings.reducedMotion
              ? 'border-primary bg-primary/10'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium text-sm sm:text-base">Ограничи анимациите</span>
          </div>
          <div className={`w-8 h-4 sm:w-10 sm:h-6 rounded-full transition-colors ${
            settings.reducedMotion ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'
          }`}>
            <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-white mt-0.5 sm:mt-1 transition-transform ${
              settings.reducedMotion ? 'translate-x-4 sm:translate-x-5' : 'translate-x-0.5 sm:translate-x-1'
            }`} />
          </div>
        </button>
      </div>

      {/* Reset Button */}
      <button
        onClick={resetSettings}
        className="w-full flex items-center justify-center gap-2 p-3 sm:p-4 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors font-medium text-sm sm:text-base"
      >
        <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
        Нулирай настройките
      </button>
    </div>
  )

  if (isMobile) {
    // Mobile version - integrated in header
    return (
      <>
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative group"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Accessibility settings"
          title="Настройки за достъпност"
        >
          <Accessibility className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          {JSON.stringify(settings) !== JSON.stringify(defaultSettings) && (
            <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full" />
          )}
        </motion.button>

        {/* Mobile Menu Content - Returns JSX for header integration */}
        {isOpen && <MenuContent />}
      </>
    )
  }

  // Desktop version - floating panel only (button is in Header now)
  // Use portal to render outside of any container constraints
  if (!mounted) return null

  const menuContent = (
    <>
      {/* Desktop Floating Panel - Bottom Right */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100]"
            />

            {/* Floating Panel - Bottom Right */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="fixed bottom-6 right-6 w-full max-w-sm bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl z-[101] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800"
              style={{ maxHeight: 'calc(100vh - 120px)' }}
            >
              {/* Header */}
              <div className="sticky top-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-primary/10">
                    <Accessibility className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-900 dark:text-white">
                      Достъпност
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Персонализирайте изживяването
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                <MenuContent />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* CSS Styles */}
      <style jsx global>{`
        .highlight-links a {
          text-decoration: underline !important;
          text-decoration-thickness: 2px !important;
          text-underline-offset: 3px !important;
        }
        
        .reduce-motion * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
        
        .cursor-large {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="rgba(0,0,0,0.5)"/><circle cx="16" cy="16" r="14" fill="white"/></svg>') 16 16, auto !important;
        }
        
        .cursor-large * {
          cursor: inherit !important;
        }
        
        .cursor-extra-large {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><circle cx="24" cy="24" r="24" fill="rgba(0,0,0,0.5)"/><circle cx="24" cy="24" r="22" fill="white"/></svg>') 24 24, auto !important;
        }
        
        .cursor-extra-large * {
          cursor: inherit !important;
        }
      `}</style>
    </>
  )

  const portalRoot = document.getElementById('accessibility-portal') || document.body
  return createPortal(menuContent, portalRoot)
}
