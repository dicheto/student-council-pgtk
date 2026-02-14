import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { webhook } = await request.json()

    if (!webhook) {
      return NextResponse.json(
        { error: 'Webhook URL is required' },
        { status: 400 }
      )
    }

    // Тест на webhook с просто съобщение
    const response = await fetch(webhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: '🧪 Тестово съобщение от Admin Panel',
        embeds: [
          {
            title: 'Тест на Webhook',
            description: 'Това е тестово съобщение за проверка на Discord webhook.',
            color: 0x5865f2,
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Webhook test failed' },
        { status: response.status }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error testing webhook:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
