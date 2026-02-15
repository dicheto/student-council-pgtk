import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

interface FlatDictionaryEntry {
  id: string
  key: string
  category: string
  value_en: string
  value_bg: string
  description: string
  is_html: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

const messagesDir = join(process.cwd(), 'messages')

// Load both JSON files
async function loadTranslations() {
  try {
    const [enContent, bgContent] = await Promise.all([
      readFile(join(messagesDir, 'en.json'), 'utf-8'),
      readFile(join(messagesDir, 'bg.json'), 'utf-8'),
    ])
    return {
      en: JSON.parse(enContent),
      bg: JSON.parse(bgContent),
    }
  } catch (error) {
    console.error('Error loading translations:', error)
    return { en: {}, bg: {} }
  }
}

// Flatten nested JSON to flat structure for admin panel
function flattenTranslations(
  en: Record<string, any>,
  bg: Record<string, any>
): FlatDictionaryEntry[] {
  const entries: FlatDictionaryEntry[] = []
  let id = 0

  const getNestedValue = (obj: Record<string, any>, path: string): string => {
    const parts = path.split('.')
    let current = obj
    for (const part of parts) {
      if (typeof current === 'object' && current !== null && part in current) {
        current = current[part]
      } else {
        return ''
      }
    }
    // Only return string values, skip objects
    return typeof current === 'string' ? current : ''
  }

  const flatten = (
    obj: Record<string, any>,
    category: string,
    prefix: string = ''
  ) => {
    // Get the corresponding category from BG
    const bgCategory = bg[category] || {}
    
    Object.entries(obj).forEach(([key, value]) => {
      const fullKey = prefix ? `${prefix}.${key}` : key

      if (typeof value === 'string') {
        // Look for the same nested path in bg category
        const bgValue = getNestedValue(bgCategory, fullKey)
        entries.push({
          id: `entry-${++id}`,
          key: fullKey,
          category,
          value_en: value,
          value_bg: bgValue,
          description: '',
          is_html: false,
          sort_order: id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // Recursively flatten nested objects
        flatten(value, category, fullKey)
      }
    })
  }

  Object.entries(en).forEach(([category, content]) => {
    flatten(content as any, category)
  })

  return entries
}

// Unflatten to nested structure
function unflattenTranslations(
  entries: FlatDictionaryEntry[],
  language: 'en' | 'bg'
): Record<string, any> {
  const result: Record<string, any> = {}

  entries.forEach((entry) => {
    const parts = entry.key.split('.')
    const value = language === 'en' ? entry.value_en : entry.value_bg
    let current = result

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i]
      if (!current[part]) {
        current[part] = {}
      }
      current = current[part]
    }

    current[parts[parts.length - 1]] = value
  })

  return result
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const key = searchParams.get('key')

    const translations = await loadTranslations()
    let entries = flattenTranslations(translations.en, translations.bg)

    if (category) {
      entries = entries.filter((e) => e.category === category)
    }

    if (key) {
      entries = entries.filter((e) => e.key === key)
    }

    return NextResponse.json(entries)
  } catch (error) {
    console.error('Dictionary API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dictionary' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { key, category, value_en, value_bg, description, is_html, sort_order } = body

    if (!key || !category) {
      return NextResponse.json(
        { error: 'Key and category are required' },
        { status: 400 }
      )
    }

    // Load current translations
    const translations = await loadTranslations()

    // Ensure category exists
    if (!translations.en[category]) {
      translations.en[category] = {}
      translations.bg[category] = {}
    }

    // Set the nested value
    const keys = key.split('.')
    let currentEn = translations.en[category]
    let currentBg = translations.bg[category]

    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i]
      if (!currentEn[k]) currentEn[k] = {}
      if (!currentBg[k]) currentBg[k] = {}
      currentEn = currentEn[k]
      currentBg = currentBg[k]
    }

    currentEn[keys[keys.length - 1]] = value_en
    currentBg[keys[keys.length - 1]] = value_bg

    // Save to files
    await Promise.all([
      writeFile(
        join(messagesDir, 'en.json'),
        JSON.stringify(translations.en, null, 2)
      ),
      writeFile(
        join(messagesDir, 'bg.json'),
        JSON.stringify(translations.bg, null, 2)
      ),
    ])

    // Return the entry as it would be flattened
    const allEntries = flattenTranslations(translations.en, translations.bg)
    const newEntry = allEntries.find((e) => e.key === key)

    return NextResponse.json(
      newEntry || { key, category, value_en, value_bg },
      { status: 201 }
    )
  } catch (error) {
    console.error('Dictionary API error:', error)
    return NextResponse.json(
      { error: 'Failed to create entry' },
      { status: 500 }
    )
  }
}


