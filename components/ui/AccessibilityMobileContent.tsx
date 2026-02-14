'use client'

import { useState, useEffect } from 'react'
import { 
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

export function AccessibilityMobileContent() {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings)

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
    root.style.fontSize = `${settings.fontSize}%`
    
    if (settings.letterSpacing !== 0) {
      document.body.style.letterSpacing = `${settings.letterSpacing}px`
    } else {
      document.body.style.letterSpacing = ''
    }
    
    if (settings.lineHeight !== 1.5) {
      document.body.style.lineHeight = settings.lineHeight.toString()
    } else {
      document.body.style.lineHeight = ''
    }
    
    document.body.classList.remove('high-contrast', 'dark-contrast')
    if (settings.contrast === 'high') {
      document.body.classList.add('high-contrast')
    } else if (settings.contrast === 'dark') {
      document.body.classList.add('dark-contrast')
    }
    
    document.body.style.filter = settings.grayscale ? 'grayscale(100%)' : ''
    
    if (settings.highlightLinks) {
      document.body.classList.add('highlight-links')
    } else {
      document.body.classList.remove('highlight-links')
    }
    
    if (settings.reducedMotion) {
      document.body.classList.add('reduce-motion')
    } else {
      document.body.classList.remove('reduce-motion')
    }
    
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

  return (
    <div className="space-y-3">
      {/* Font Size */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <label className="font-medium text-sm text-gray-900 dark:text-white">
              Размер на текста
            </label>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {settings.fontSize}%
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => updateSetting('fontSize', Math.max(75, settings.fontSize - 10))}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <ZoomOut className="w-3 h-3" />
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
          >
            <ZoomIn className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Letter Spacing */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Minus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <label className="font-medium text-sm text-gray-900 dark:text-white">
              Разстояние между буквите
            </label>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
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
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <label className="font-medium text-sm text-gray-900 dark:text-white">
              Височина на реда
            </label>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
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
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Contrast className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <label className="font-medium text-sm text-gray-900 dark:text-white">
            Контраст
          </label>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {(['normal', 'high', 'dark'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => updateSetting('contrast', mode)}
              className={`p-2 rounded-lg border-2 transition-all text-xs ${
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
      <div className="space-y-2 pt-2 border-t border-white/10">
        {/* Grayscale */}
        <button
          onClick={() => updateSetting('grayscale', !settings.grayscale)}
          className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
            settings.grayscale
              ? 'border-primary bg-primary/10'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
        >
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            <span className="font-medium text-sm">Монохромен режим</span>
          </div>
          <div className={`w-8 h-4 rounded-full transition-colors ${
            settings.grayscale ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'
          }`}>
            <div className={`w-3 h-3 rounded-full bg-white mt-0.5 transition-transform ${
              settings.grayscale ? 'translate-x-4' : 'translate-x-0.5'
            }`} />
          </div>
        </button>

        {/* Highlight Links */}
        <button
          onClick={() => updateSetting('highlightLinks', !settings.highlightLinks)}
          className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
            settings.highlightLinks
              ? 'border-primary bg-primary/10'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
        >
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span className="font-medium text-sm">Подчертай връзките</span>
          </div>
          <div className={`w-8 h-4 rounded-full transition-colors ${
            settings.highlightLinks ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'
          }`}>
            <div className={`w-3 h-3 rounded-full bg-white mt-0.5 transition-transform ${
              settings.highlightLinks ? 'translate-x-4' : 'translate-x-0.5'
            }`} />
          </div>
        </button>

        {/* Reduced Motion */}
        <button
          onClick={() => updateSetting('reducedMotion', !settings.reducedMotion)}
          className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
            settings.reducedMotion
              ? 'border-primary bg-primary/10'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
        >
          <div className="flex items-center gap-2">
            <EyeOff className="w-4 h-4" />
            <span className="font-medium text-sm">Ограничи анимациите</span>
          </div>
          <div className={`w-8 h-4 rounded-full transition-colors ${
            settings.reducedMotion ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'
          }`}>
            <div className={`w-3 h-3 rounded-full bg-white mt-0.5 transition-transform ${
              settings.reducedMotion ? 'translate-x-4' : 'translate-x-0.5'
            }`} />
          </div>
        </button>
      </div>

      {/* Reset Button */}
      <button
        onClick={resetSettings}
        className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors font-medium text-sm"
      >
        <RotateCcw className="w-4 h-4" />
        Нулирай настройките
      </button>
    </div>
  )
}
