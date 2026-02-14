// lib/actions/news.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface CreateNewsInput {
  title: string
  content: string
  excerpt?: string
  imageUrls?: string[]
  featuredImageUrl?: string
  language: 'en' | 'bg'
  publishToDiscord?: boolean
  status?: 'draft' | 'published' | 'archived'
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string
}

export interface UpdateNewsInput extends CreateNewsInput {
  id: string
}

// Generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function createNews(input: CreateNewsInput) {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { error: 'Unauthorized' }
    }

    const slug = generateSlug(input.title)

    const { data, error } = await supabase
      .from('news')
      .insert({
        title: input.title,
        slug,
        content: input.content,
        excerpt: input.excerpt,
        image_urls: input.imageUrls || [],
        featured_image_url: input.featuredImageUrl,
        author_id: user.id,
        language: input.language,
        publish_to_discord: input.publishToDiscord || false,
        status: input.status || 'draft',
        seo_title: input.seoTitle,
        seo_description: input.seoDescription,
        seo_keywords: input.seoKeywords,
        published_at:
          input.status === 'published' ? new Date().toISOString() : null,
      })
      .select()
      .single()

    if (error) {
      return { error: error.message }
    }

    // Revalidate cache
    revalidatePath('/news')
    revalidatePath(`/news/${slug}`)

    return { data, success: true }
  } catch (error) {
    return { error: String(error) }
  }
}

export async function updateNews(input: UpdateNewsInput) {
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

    const { data, error } = await supabase
      .from('news')
      .update({
        title: input.title,
        slug,
        content: input.content,
        excerpt: input.excerpt,
        image_urls: input.imageUrls || [],
        featured_image_url: input.featuredImageUrl,
        language: input.language,
        publish_to_discord: input.publishToDiscord || false,
        status: input.status || 'draft',
        seo_title: input.seoTitle,
        seo_description: input.seoDescription,
        seo_keywords: input.seoKeywords,
        published_at:
          input.status === 'published' ? new Date().toISOString() : null,
      })
      .eq('id', input.id)
      .eq('author_id', user.id)
      .select()
      .single()

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/news')
    revalidatePath(`/news/${slug}`)

    return { data, success: true }
  } catch (error) {
    return { error: String(error) }
  }
}

export async function deleteNews(id: string) {
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
      .from('news')
      .delete()
      .eq('id', id)
      .eq('author_id', user.id)

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/news')

    return { success: true }
  } catch (error) {
    return { error: String(error) }
  }
}

export async function getNews(id: string) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return { error: error.message }
    }

    return { data, success: true }
  } catch (error) {
    return { error: String(error) }
  }
}

export async function listNews(
  language: 'en' | 'bg',
  status: 'published' | 'draft' | 'all' = 'published'
) {
  try {
    const supabase = await createClient()

    let query = supabase
      .from('news')
      .select('*')
      .eq('language', language)
      .order('published_at', { ascending: false })

    if (status !== 'all') {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      return { error: error.message }
    }

    return { data, success: true }
  } catch (error) {
    return { error: String(error) }
  }
}
