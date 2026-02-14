import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/dictionary
 * Fetch dictionary entries filtered by category or key
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const key = searchParams.get('key')
    const language = searchParams.get('language') || 'bg'

    let query = supabase
      .from('dictionary')
      .select('*')
      .order('sort_order', { ascending: true })

    if (category) {
      query = query.eq('category', category)
    }

    if (key) {
      query = query.eq('key', key)
    }

    const { data, error } = await query

    if (error) {
      console.error('Dictionary fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch dictionary' },
        { status: 500 }
      )
    }

    // Transform to return the correct language
    const transformed = data?.map((item) => ({
      ...item,
      value: language === 'en' ? item.value_en : item.value_bg,
    })) || []

    return NextResponse.json(transformed)
  } catch (error) {
    console.error('Dictionary API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/dictionary
 * Create a new dictionary entry (admin only)
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

    const { key, category, value_en, value_bg, description, is_html, sort_order } = body

    if (!key || !category) {
      return NextResponse.json(
        { error: 'Key and category are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('dictionary')
      .insert([
        {
          key,
          category,
          value_en,
          value_bg,
          description,
          is_html,
          sort_order,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Dictionary insert error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Dictionary API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
