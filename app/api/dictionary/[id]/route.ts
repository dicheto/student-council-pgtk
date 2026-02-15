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
        flatten(value, category, fullKey)
      }
    })
  }

  Object.entries(en).forEach(([category, content]) => {
    flatten(content as any, category)
  })

  return entries
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id

    if (!id) {
      return NextResponse.json(
        { error: 'Entry ID is required' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { key, value_en, value_bg, category } = body

    if (!key || !category) {
      return NextResponse.json(
        { error: 'Key and category are required' },
        { status: 400 }
      )
    }

    const translations = await loadTranslations()

    const allEntriesBefore = flattenTranslations(translations.en, translations.bg)
    const oldEntry = allEntriesBefore.find((e) => e.id === id)

    if (oldEntry && oldEntry.key !== key) {
      const oldKeys = oldEntry.key.split('.')
      let current = translations.en[oldEntry.category]
      for (let i = 0; i < oldKeys.length - 1; i++) {
        current = current?.[oldKeys[i]]
      }
      if (current) delete (current as any)?.[oldKeys[oldKeys.length - 1]]

      current = translations.bg[oldEntry.category]
      for (let i = 0; i < oldKeys.length - 1; i++) {
        current = current?.[oldKeys[i]]
      }
      if (current) delete (current as any)?.[oldKeys[oldKeys.length - 1]]
    }

    if (!translations.en[category]) {
      translations.en[category] = {}
      translations.bg[category] = {}
    }

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

    return NextResponse.json({ key, category, value_en, value_bg })
  } catch (error) {
    console.error('Dictionary API error:', error)
    return NextResponse.json(
      { error: 'Failed to update entry' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id

    if (!id) {
      return NextResponse.json(
        { error: 'Entry ID is required' },
        { status: 400 }
      )
    }

    const translations = await loadTranslations()

    const allEntries = flattenTranslations(translations.en, translations.bg)
    const entry = allEntries.find((e) => e.id === id)

    if (!entry) {
      return NextResponse.json(
        { error: 'Entry not found' },
        { status: 404 }
      )
    }

    const keys = entry.key.split('.')
    let current = translations.en[entry.category]
    for (let i = 0; i < keys.length - 1; i++) {
      current = current?.[keys[i]]
    }
    if (current) delete (current as any)?.[keys[keys.length - 1]]

    current = translations.bg[entry.category]
    for (let i = 0; i < keys.length - 1; i++) {
      current = current?.[keys[i]]
    }
    if (current) delete (current as any)?.[keys[keys.length - 1]]

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

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Dictionary API error:', error)
    return NextResponse.json(
      { error: 'Failed to delete entry' },
      { status: 500 }
    )
  }
}
