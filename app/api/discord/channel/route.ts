import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { channelId } = await request.json()

    if (!channelId) {
      return NextResponse.json(
        { error: 'Channel ID is required' },
        { status: 400 }
      )
    }

    // В production, това трябва да се запази в база данни
    // За сега ще го запазим в environment variable или в Supabase
    process.env.DISCORD_CHANNEL_ID = channelId

    return NextResponse.json({ success: true, channelId })
  } catch (error) {
    console.error('Error setting channel:', error)
    return NextResponse.json(
      { error: 'Failed to set channel' },
      { status: 500 }
    )
  }
}
