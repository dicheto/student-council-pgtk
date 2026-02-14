import { NextResponse } from 'next/server'
import { Feed } from 'feed'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale') || 'bg'

    // Get published news
    const { data: news } = await supabase
      .from('news')
      .select('title, content, excerpt, slug, created_at, images_urls')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(20)

    if (!news) {
      return NextResponse.json({ error: 'No news found' }, { status: 404 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const feed = new Feed({
      title: locale === 'bg' ? 'Ученически Съвет - Новини' : 'Student Council - News',
      description: locale === 'bg' 
        ? 'Последни новини от Ученическия Съвет'
        : 'Latest news from the Student Council',
      id: `${baseUrl}/${locale}/news`,
      link: `${baseUrl}/${locale}/news`,
      language: locale,
      copyright: `© ${new Date().getFullYear()} Ученически Съвет - ПГТК`,
      generator: 'Next.js RSS Generator',
      feedLinks: {
        rss: `${baseUrl}/api/rss?locale=${locale}`,
      },
    })

    news.forEach((item) => {
      const title = typeof item.title === 'object' ? item.title[locale] || item.title.bg : item.title
      const content = typeof item.content === 'object' ? item.content[locale] || item.content.bg : item.content
      const excerpt = typeof item.excerpt === 'object' ? item.excerpt[locale] || item.excerpt.bg : item.excerpt

      feed.addItem({
        title: title,
        id: `${baseUrl}/${locale}/news/${item.slug}`,
        link: `${baseUrl}/${locale}/news/${item.slug}`,
        description: excerpt || content?.substring(0, 200),
        content: content,
        date: new Date(item.created_at),
        image: item.images_urls && item.images_urls.length > 0 ? item.images_urls[0] : undefined,
      })
    })

    return new NextResponse(feed.rss2(), {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
      },
    })
  } catch (error) {
    console.error('Error generating RSS:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
