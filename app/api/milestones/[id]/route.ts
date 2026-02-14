import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// PUT - Update milestone (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Update milestone
    const { data, error } = await supabase
      .from('timeline_milestones')
      .update({
        ...(title && { title }),
        ...(description && { description }),
        ...(month && { month }),
        ...(year && { year }),
        ...(icon && { icon }),
        ...(color && { color }),
        ...(typeof is_highlighted === 'boolean' && { is_highlighted }),
        ...(typeof display_order === 'number' && { display_order }),
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating milestone:', error)
      return NextResponse.json(
        { error: 'Failed to update milestone' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete milestone (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Delete milestone
    const { error } = await supabase
      .from('timeline_milestones')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Error deleting milestone:', error)
      return NextResponse.json(
        { error: 'Failed to delete milestone' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
