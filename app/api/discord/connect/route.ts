import { NextRequest, NextResponse } from 'next/server'
import { getDiscordClient, disconnectDiscordClient } from '@/lib/discord/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const { action } = body

    if (action === 'disconnect') {
      await disconnectDiscordClient()
      return NextResponse.json({ 
        success: true, 
        message: 'Bot disconnected successfully' 
      })
    }

    // Connect action
    const client = await getDiscordClient()
    
    if (!client) {
      return NextResponse.json(
        { error: 'Discord client not configured. Check DISCORD_BOT_TOKEN in .env.local' },
        { status: 500 }
      )
    }

    if (client.isReady()) {
      return NextResponse.json({ 
        success: true, 
        message: 'Bot is already connected',
        bot: {
          id: client.user?.id,
          username: client.user?.username,
          tag: client.user?.tag,
        },
      })
    }

    // Wait for connection (max 10 seconds)
    for (let i = 0; i < 20; i++) {
      await new Promise(resolve => setTimeout(resolve, 500))
      if (client.isReady()) {
        return NextResponse.json({ 
          success: true, 
          message: 'Bot connected successfully',
          bot: {
            id: client.user?.id,
            username: client.user?.username,
            tag: client.user?.tag,
          },
        })
      }
    }

    return NextResponse.json(
      { error: 'Connection timeout. Bot may still be connecting.' },
      { status: 504 }
    )
  } catch (error: any) {
    console.error('Error connecting bot:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to connect bot' },
      { status: 500 }
    )
  }
}
