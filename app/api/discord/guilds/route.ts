import { NextResponse } from 'next/server'
import { getDiscordClient } from '@/lib/discord/client'

export async function GET() {
  try {
    const client = await getDiscordClient()
    
    if (!client || !client.isReady()) {
      return NextResponse.json({ guilds: [] })
    }

    const guilds = client.guilds.cache.map(guild => ({
      id: guild.id,
      name: guild.name,
      icon: guild.iconURL(),
      memberCount: guild.memberCount,
      ownerId: guild.ownerId,
      description: guild.description,
      features: guild.features,
      createdAt: guild.createdAt?.toISOString(),
    }))

    return NextResponse.json({ guilds: Array.from(guilds) })
  } catch (error) {
    console.error('Error getting guilds:', error)
    return NextResponse.json(
      { error: 'Failed to get guilds' },
      { status: 500 }
    )
  }
}
