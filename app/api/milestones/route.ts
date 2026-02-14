import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Fetch all milestones
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('timeline_milestones')
      .select('*')
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching milestones:', error)
      return NextResponse.json(
        { error: 'Failed to fetch milestones' },
        { status: 500 }
      )
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create new milestone (admin only)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { title, description, month, year, icon, color, is_highlighted, display_order } = body

    if (!title || !description || !month || !year) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Insert new milestone
    const { data, error } = await supabase
      .from('timeline_milestones')
      .insert({
        title,
        description,
        month,
        year,
        icon: icon || 'Calendar',
        color: color || 'from-blue-500 to-cyan-500',
        is_highlighted: is_highlighted || false,
        display_order: display_order || 0,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating milestone:', error)
      return NextResponse.json(
        { error: 'Failed to create milestone' },
        { status: 500 }
      )
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
