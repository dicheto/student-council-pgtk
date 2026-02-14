import { NextRequest, NextResponse } from 'next/server'
import { getDiscordClient } from '@/lib/discord/client'

export async function GET(request: NextRequest) {
  try {
    const client = await getDiscordClient()
    
    if (!client || !client.isReady()) {
      return NextResponse.json({ channels: [] })
    }

    const searchParams = request.nextUrl.searchParams
    const guildId = searchParams.get('guildId') || process.env.DISCORD_GUILD_ID

    if (!guildId) {
      return NextResponse.json({ channels: [] })
    }

    const guild = client.guilds.cache.get(guildId)
    if (!guild) {
      return NextResponse.json({ channels: [] })
    }

    // Fetch all channels (including categories)
    await guild.channels.fetch()

    const channels = guild.channels.cache
      .map(channel => ({
        id: channel.id,
        name: channel.name,
        type: channel.type,
        parentId: channel.parentId,
        position: channel.position,
        topic: (channel as any).topic,
        nsfw: (channel as any).nsfw,
        permissionOverwrites: (channel as any).permissionOverwrites?.cache?.size || 0,
      }))
      .sort((a, b) => a.position - b.position)

    return NextResponse.json({ 
      channels: Array.from(channels),
      guild: {
        id: guild.id,
        name: guild.name,
      },
    })
  } catch (error) {
    console.error('Error getting channels:', error)
    return NextResponse.json(
      { error: 'Failed to get channels' },
      { status: 500 }
    )
  }
}
