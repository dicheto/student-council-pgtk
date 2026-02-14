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

    const body = await request.json()
    const { title, content, excerpt, slug, images_urls, status, publishToDiscord } = body

    // Insert news
    const { data: news, error } = await supabase
      .from('news')
      .insert({
        title,
        content,
        excerpt,
        slug,
        images_urls: images_urls || [],
        author_id: user.id,
        status,
        published_at: status === 'published' ? new Date().toISOString() : null,
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to create news' },
        { status: 500 }
      )
    }

    // Post to Discord if enabled
    if (publishToDiscord && status === 'published') {
      try {
        await fetch(`${request.nextUrl.origin}/api/discord/post`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            newsId: news.id,
            publishToDiscord: true,
          }),
        })
      } catch (discordError) {
        console.error('Discord post error:', discordError)
        // Don't fail the request if Discord fails
      }
    }

    return NextResponse.json({ id: news.id, ...news })
  } catch (error) {
    console.error('Error creating news:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'published'
    const limit = parseInt(searchParams.get('limit') || '10')

    const { data: news, error } = await supabase
      .from('news')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch news' },
        { status: 500 }
      )
    }

    return NextResponse.json({ news })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
