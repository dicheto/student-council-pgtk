import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { newsId, publishToDiscord } = await request.json()

    if (!publishToDiscord) {
      return NextResponse.json({ success: true, message: 'Discord publishing skipped' })
    }

    // Get Discord settings
    const { data: discordSettings } = await supabase
      .from('discord_settings')
      .select('webhook_url, enabled')
      .single()

    if (!discordSettings?.enabled || !discordSettings.webhook_url) {
      return NextResponse.json(
        { error: 'Discord not configured' },
        { status: 400 }
      )
    }

    // Get news item
    const { data: news } = await supabase
      .from('news')
      .select('title, content, excerpt, images_urls, slug')
      .eq('id', newsId)
      .single()

    if (!news) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 })
    }

    // Get locale from request or default to bg
    const locale = request.headers.get('x-locale') || 'bg'
    const title = typeof news.title === 'object' ? news.title[locale] || news.title.bg : news.title
    const description = typeof news.excerpt === 'object' 
      ? news.excerpt[locale] || news.excerpt.bg 
      : news.excerpt || (typeof news.content === 'object' ? news.content[locale]?.substring(0, 200) : news.content?.substring(0, 200))

    // Create Rich Embed
    const embed: any = {
      title: title,
      description: description + '...',
      color: 0x0047AB, // Deep Blue
      timestamp: new Date().toISOString(),
      url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/${locale}/news/${news.slug}`,
      footer: {
        text: 'Ученически Съвет - ПГТК',
      },
    }

    // Add image if available
    if (news.images_urls && news.images_urls.length > 0 && news.images_urls[0]) {
      embed.image = {
        url: news.images_urls[0],
      }
    }

    // Send to Discord
    const response = await fetch(discordSettings.webhook_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        embeds: [embed],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Discord webhook error:', errorText)
      return NextResponse.json(
        { error: 'Failed to post to Discord' },
        { status: response.status }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error posting to Discord:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
