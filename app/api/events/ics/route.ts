import { NextRequest, NextResponse } from 'next/server'
import { createEvent } from 'ics'

export async function POST(request: NextRequest) {
  try {
    const { title, description, startDate, endDate, location } = await request.json()

    if (!title || !startDate) {
      return NextResponse.json(
        { error: 'Title and start date are required' },
        { status: 400 }
      )
    }

    const start = new Date(startDate)
    const end = endDate ? new Date(endDate) : new Date(start.getTime() + 60 * 60 * 1000) // Default 1 hour

    const event = {
      title: title,
      description: description || '',
      location: location || '',
      start: [
        start.getFullYear(),
        start.getMonth() + 1,
        start.getDate(),
        start.getHours(),
        start.getMinutes(),
      ] as [number, number, number, number, number],
      end: [
        end.getFullYear(),
        end.getMonth() + 1,
        end.getDate(),
        end.getHours(),
        end.getMinutes(),
      ] as [number, number, number, number, number],
      status: 'CONFIRMED' as const,
      busyStatus: 'BUSY' as const,
      organizer: {
        name: 'Ученически Съвет - ПГТК',
      },
    }

    const { error, value } = createEvent(event)

    if (error) {
      console.error('ICS creation error:', error)
      return NextResponse.json(
        { error: 'Failed to create ICS file' },
        { status: 500 }
      )
    }

    return new NextResponse(value, {
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="${title.replace(/[^a-z0-9]/gi, '_')}.ics"`,
      },
    })
  } catch (error) {
    console.error('Error generating ICS:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
