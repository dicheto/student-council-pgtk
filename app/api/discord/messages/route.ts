import { NextRequest, NextResponse } from 'next/server'
import { getDiscordClient } from '@/lib/discord/client'

export async function GET(request: NextRequest) {
  try {
    const client = await getDiscordClient()
    
    if (!client || !client.isReady()) {
      return NextResponse.json({ messages: [] })
    }

    const searchParams = request.nextUrl.searchParams
    const channelId = searchParams.get('channelId') || process.env.DISCORD_CHANNEL_ID
    const limit = parseInt(searchParams.get('limit') || '50')

    if (!channelId) {
      return NextResponse.json({ messages: [] })
    }

    const channel = await client.channels.fetch(channelId)
    if (!channel || !channel.isTextBased()) {
      return NextResponse.json({ messages: [] })
    }

    const messages = await channel.messages.fetch({ limit: Math.min(limit, 100) })

    const formattedMessages = messages.map(msg => ({
      id: msg.id,
      content: msg.content,
      author: {
        id: msg.author.id,
        username: msg.author.username,
        discriminator: msg.author.discriminator,
        tag: msg.author.tag,
        avatar: msg.author.avatarURL(),
        bot: msg.author.bot,
      },
      embeds: msg.embeds,
      attachments: msg.attachments.map(att => ({
        id: att.id,
        url: att.url,
        name: att.name,
        size: att.size,
      })),
      reactions: msg.reactions.cache.map(reaction => ({
        emoji: reaction.emoji.name,
        count: reaction.count,
      })),
      createdAt: msg.createdAt.toISOString(),
      editedAt: msg.editedAt?.toISOString(),
      pinned: msg.pinned,
    }))

    return NextResponse.json({ 
      messages: Array.from(formattedMessages).reverse(),
      channel: {
        id: channel.id,
        name: (channel as any).name,
      },
    })
  } catch (error) {
    console.error('Error getting messages:', error)
    return NextResponse.json(
      { error: 'Failed to get messages' },
      { status: 500 }
    )
  }
}
