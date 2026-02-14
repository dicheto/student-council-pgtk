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
    const { channelId, messageId, content, embed } = body

    if (!channelId || !messageId) {
      return NextResponse.json(
        { error: 'Channel ID and Message ID are required' },
        { status: 400 }
      )
    }

    const channel = await client.channels.fetch(channelId)
    if (!channel || !channel.isTextBased()) {
      return NextResponse.json(
        { error: 'Invalid channel' },
        { status: 400 }
      )
    }

    const message = await channel.messages.fetch(messageId)
    if (!message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      )
    }

    const editOptions: any = {}
    if (content !== undefined) editOptions.content = content
    if (embed) editOptions.embeds = [embed]

    const editedMessage = await message.edit(editOptions)

    return NextResponse.json({
      success: true,
      message: {
        id: editedMessage.id,
        content: editedMessage.content,
        editedAt: editedMessage.editedAt?.toISOString(),
      },
    })
  } catch (error: any) {
    console.error('Error editing message:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to edit message' },
      { status: 500 }
    )
  }
}
