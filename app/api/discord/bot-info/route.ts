import { NextResponse } from 'next/server'
import { getDiscordClient } from '@/lib/discord/client'

export async function GET() {
  try {
    const client = await getDiscordClient()
    
    if (!client) {
      return NextResponse.json({
        connected: false,
        error: 'Bot token not configured',
      })
    }

    if (!client.isReady()) {
      return NextResponse.json({
        connected: false,
        status: 'connecting',
      })
    }

    const user = client.user
    const guilds = client.guilds.cache
    const channels = client.channels.cache

    return NextResponse.json({
      connected: true,
      bot: {
        id: user?.id,
        username: user?.username,
        discriminator: user?.discriminator,
        tag: user?.tag,
        avatar: user?.avatarURL(),
        bot: user?.bot,
        createdAt: user?.createdAt?.toISOString(),
      },
      stats: {
        guilds: guilds.size,
        channels: channels.size,
        users: guilds.reduce((acc, guild) => acc + guild.memberCount, 0),
      },
      status: user?.presence?.status || 'offline',
      shards: client.shard?.count || 1,
    })
  } catch (error) {
    console.error('Error getting bot info:', error)
    return NextResponse.json(
      { error: 'Failed to get bot info', connected: false },
      { status: 500 }
    )
  }
}
