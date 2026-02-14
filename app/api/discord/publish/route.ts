import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { webhook, title, content, excerpt, images } = await request.json()

    if (!webhook || !title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Създаване на Rich Embed за Discord
    const embed = {
      title: title,
      description: excerpt || content.substring(0, 200) + '...',
      color: 0x1e3a8a, // Primary blue color
      timestamp: new Date().toISOString(),
      footer: {
        text: 'Ученически Съвет - ПГТК',
      },
      fields: [
        {
          name: '📰 Нова Статия',
          value: 'Публикувана от Admin Panel',
          inline: false,
        },
      ],
    }

    // Добавяне на изображения ако има
    if (images && images.length > 0 && images[0]) {
      embed.image = {
        url: images[0], // Първото изображение като главно
      }
    }

    const response = await fetch(webhook, {
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
        { error: 'Failed to publish to Discord' },
        { status: response.status }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error publishing to Discord:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
