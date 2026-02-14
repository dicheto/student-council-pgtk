import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * PUT /api/team-members/[id]
 * Update a team member (admin only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { id } = params
    const body = await request.json()

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
      is_visible,
    } = body

    const { data, error } = await supabase
      .from('team_members_data')
      .update({
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
        is_visible,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Team member update error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Team members API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/team-members/[id]
 * Delete a team member (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { id } = params

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

    const { error } = await supabase
      .from('team_members_data')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Team member delete error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Team members API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
