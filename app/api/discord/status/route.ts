import { NextResponse } from 'next/server'
import { getDiscordClient } from '@/lib/discord/client'

export async function GET() {
  try {
    const client = await getDiscordClient()
    
    if (!client) {
      return NextResponse.json({
        status: 'offline',
        connected: false,
        webhook: process.env.DISCORD_WEBHOOK_URL || '',
        channel: process.env.DISCORD_CHANNEL_ID || '',
      })
    }

    if (!client.isReady()) {
      return NextResponse.json({
        status: 'offline',
        connected: false,
        webhook: process.env.DISCORD_WEBHOOK_URL || '',
        channel: process.env.DISCORD_CHANNEL_ID || '',
      })
    }

    const status = client.user?.presence?.status || 'offline'
    const webhook = process.env.DISCORD_WEBHOOK_URL || ''
    const channel = process.env.DISCORD_CHANNEL_ID || ''

    return NextResponse.json({
      status: status === 'online' ? 'online' : status === 'idle' ? 'idle' : status === 'dnd' ? 'dnd' : 'offline',
      connected: true,
      webhook,
      channel,
      bot: {
        id: client.user?.id,
        username: client.user?.username,
        tag: client.user?.tag,
      },
    })
  } catch (error) {
    console.error('Error getting Discord status:', error)
    return NextResponse.json(
      { error: 'Failed to get status', connected: false },
      { status: 500 }
    )
  }
}
