// lib/actions/events.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { createEvent } from 'ics'

export interface CreateEventInput {
  title: string
  description?: string
  date: string // ISO string
  endDate?: string // ISO string
  location?: string
  locationUrl?: string
  imageUrl?: string
  color?: string
  language: 'en' | 'bg'
}

export interface UpdateEventInput extends CreateEventInput {
  id: string
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function generateICS(event: {
  title: string
  description?: string
  date: string
  endDate?: string
  location?: string
  locationUrl?: string
}) {
  const startDate = new Date(event.date)
  const endDate = event.endDate ? new Date(event.endDate) : new Date(startDate.getTime() + 3600000)

  const icsEvent = createEvent({
    title: event.title,
    description: event.description || '',
    start: [
      startDate.getFullYear(),
      startDate.getMonth() + 1,
      startDate.getDate(),
      startDate.getHours(),
      startDate.getMinutes(),
    ],
    end: [
      endDate.getFullYear(),
      endDate.getMonth() + 1,
      endDate.getDate(),
      endDate.getHours(),
      endDate.getMinutes(),
    ],
    location: event.location || '',
    url: event.locationUrl,
  })

  if (icsEvent.error) {
    return null
  }

  return icsEvent.value
}

export async function createEvent(input: CreateEventInput) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { error: 'Unauthorized' }
    }

    const slug = generateSlug(input.title)
    const icsData = generateICS(input)

    const { data, error } = await supabase
      .from('events')
      .insert({
        title: input.title,
        slug,
        description: input.description,
        date: input.date,
        end_date: input.endDate,
        location: input.location,
        location_url: input.locationUrl,
        image_url: input.imageUrl,
        color: input.color || '#0047AB',
        ics_data: icsData,
        language: input.language,
        author_id: user.id,
        is_published: true,
      })
      .select()
      .single()

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/events')
    revalidatePath(`/events/${slug}`)

    return { data, success: true }
  } catch (error) {
    return { error: String(error) }
  }
}

export async function updateEvent(input: UpdateEventInput) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { error: 'Unauthorized' }
    }

    const slug = generateSlug(input.title)
    const icsData = generateICS(input)

    const { data, error } = await supabase
      .from('events')
      .update({
        title: input.title,
        slug,
        description: input.description,
        date: input.date,
        end_date: input.endDate,
        location: input.location,
        location_url: input.locationUrl,
        image_url: input.imageUrl,
        color: input.color || '#0047AB',
        ics_data: icsData,
        language: input.language,
      })
      .eq('id', input.id)
      .eq('author_id', user.id)
      .select()
      .single()

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/events')
    revalidatePath(`/events/${slug}`)

    return { data, success: true }
  } catch (error) {
    return { error: String(error) }
  }
}

export async function deleteEvent(id: string) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { error: 'Unauthorized' }
    }

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)
      .eq('author_id', user.id)

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/events')

    return { success: true }
  } catch (error) {
    return { error: String(error) }
  }
}

export async function listEvents(language: 'en' | 'bg') {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('language', language)
      .eq('is_published', true)
      .order('date', { ascending: true })

    if (error) {
      return { error: error.message }
    }

    return { data, success: true }
  } catch (error) {
    return { error: String(error) }
  }
}
