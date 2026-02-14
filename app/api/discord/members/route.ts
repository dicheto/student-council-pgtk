import { NextRequest, NextResponse } from 'next/server'
import { getDiscordClient } from '@/lib/discord/client'

export async function GET(request: NextRequest) {
  try {
    const client = await getDiscordClient()
    
    if (!client || !client.isReady()) {
      return NextResponse.json({ members: [] })
    }

    const searchParams = request.nextUrl.searchParams
    const guildId = searchParams.get('guildId') || process.env.DISCORD_GUILD_ID

    if (!guildId) {
      return NextResponse.json({ members: [] })
    }

    const guild = await client.guilds.fetch(guildId)
    if (!guild) {
      return NextResponse.json({ members: [] })
    }

    // Fetch all members
    await guild.members.fetch()

    const members = guild.members.cache.map(member => ({
      id: member.id,
      username: member.user.username,
      discriminator: member.user.discriminator,
      tag: member.user.tag,
      avatar: member.user.avatarURL(),
      bot: member.user.bot,
      displayName: member.displayName,
      nickname: member.nickname,
      roles: member.roles.cache.map(role => ({
        id: role.id,
        name: role.name,
        color: role.color,
      })),
      joinedAt: member.joinedAt?.toISOString(),
      premiumSince: member.premiumSince?.toISOString(),
      presence: member.presence?.status || 'offline',
    }))

    return NextResponse.json({ 
      members: Array.from(members),
      guild: {
        id: guild.id,
        name: guild.name,
        memberCount: guild.memberCount,
      },
    })
  } catch (error) {
    console.error('Error getting members:', error)
    return NextResponse.json(
      { error: 'Failed to get members' },
      { status: 500 }
    )
  }
}
