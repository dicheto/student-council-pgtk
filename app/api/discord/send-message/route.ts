import { NextRequest, NextResponse } from 'next/server'
import { getDiscordClient } from '@/lib/discord/client'

export async function POST(request: NextRequest) {
  try {
    const client = await getDiscordClient()
    
    if (!client || !client.isReady()) {
      return NextResponse.json(
        { error: 'Bot is not connected' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { channelId, content, embed } = body

    if (!channelId) {
      return NextResponse.json(
        { error: 'Channel ID is required' },
        { status: 400 }
      )
    }

    const channel = await client.channels.fetch(channelId)
    if (!channel || !channel.isTextBased()) {
      return NextResponse.json(
        { error: 'Invalid channel or channel is not text-based' },
        { status: 400 }
      )
    }

    const messageOptions: any = {}
    if (content) messageOptions.content = content
    if (embed) messageOptions.embeds = [embed]

    const message = await channel.send(messageOptions)

    return NextResponse.json({
      success: true,
      message: {
        id: message.id,
        content: message.content,
        author: {
          id: message.author.id,
          username: message.author.username,
          avatar: message.author.avatarURL(),
        },
        createdAt: message.createdAt.toISOString(),
      },
    })
  } catch (error: any) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to send message' },
      { status: 500 }
    )
  }
}
