// app/api/discord/post-news/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

interface NewsData {
  id: string
  title: string
  excerpt?: string
  featured_image_url?: string
  slug: string
}

export async function POST(request: NextRequest) {
  try {
    const body: NewsData = await request.json()

    const supabase = await createClient()

    // Get Discord settings
    const { data: settings } = await supabase
      .from('discord_settings')
      .select('*')
      .eq('is_active', true)
      .single()

    if (!settings?.webhook_url) {
      return NextResponse.json(
        { error: 'Discord webhook not configured' },
        { status: 400 }
      )
    }

    // Create Discord embed
    const embed = {
      title: body.title,
      description: body.excerpt || 'New article published',
      url: `${process.env.NEXT_PUBLIC_APP_URL}/news/${body.slug}`,
      color: 0x0047ab, // Deep Blue
      image: body.featured_image_url
        ? {
            url: body.featured_image_url,
          }
        : undefined,
      timestamp: new Date().toISOString(),
    }

    // Send to Discord
    const response = await fetch(settings.webhook_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        embeds: [embed],
      }),
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to post to Discord' },
        { status: response.status }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    )
  }
}
