import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { webhookUrl } = await request.json()

    if (!webhookUrl) {
      return NextResponse.json(
        { error: 'Webhook URL is required' },
        { status: 400 }
      )
    }

    // В production, това трябва да се запази в база данни
    // За сега ще го запазим в environment variable или в Supabase
    process.env.DISCORD_WEBHOOK_URL = webhookUrl

    return NextResponse.json({ success: true, webhookUrl })
  } catch (error) {
    console.error('Error saving webhook:', error)
    return NextResponse.json(
      { error: 'Failed to save webhook' },
      { status: 500 }
    )
  }
}
