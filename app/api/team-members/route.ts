import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/team-members
 * Fetch team members
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('team_members_data')
      .select('*')
      .eq('is_visible', true)
      .order('position_order', { ascending: true })

    if (error) {
      console.error('Team members fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch team members' },
        { status: 500 }
      )
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Team members API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/team-members
 * Create a new team member (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (!user || authError) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check admin role
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const body = await request.json()

    const {
      name_en,
      name_bg,
      role_en,
      role_bg,
      description_en,
      description_bg,
      badge_en,
      badge_bg,
      email,
      instagram,
      image_url,
      position_order,
    } = body

    if (!name_en || !name_bg || !role_en || !role_bg) {
      return NextResponse.json(
        { error: 'Required fields missing' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('team_members_data')
      .insert([
        {
          name_en,
          name_bg,
          role_en,
          role_bg,
          description_en,
          description_bg,
          badge_en,
          badge_bg,
          email,
          instagram,
          image_url,
          position_order: position_order || 0,
          is_visible: true,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Team member insert error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Team members API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
