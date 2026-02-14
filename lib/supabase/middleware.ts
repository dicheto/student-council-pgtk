// lib/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // refreshing the auth token
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      console.log('[Middleware] No user - redirecting to login')
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Use service role key for admin check (bypasses RLS)
    const adminClient = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              supabaseResponse.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    try {
      const { data: profile, error } = await adminClient
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      console.log('[Middleware] User ID:', user.id, '| Profile role:', profile?.role, '| Error:', error?.message)

      if (error) {
        console.log('[Middleware] Profile fetch error:', error.message)
        return NextResponse.redirect(new URL('/', request.url))
      }

      if (!profile || (profile.role !== 'admin' && profile.role !== 'editor')) {
        console.log('[Middleware] User role not admin/editor:', profile?.role)
        return NextResponse.redirect(new URL('/', request.url))
      }

      console.log('[Middleware] ✅ Admin access granted for user:', user.id)
    } catch (err) {
      console.error('[Middleware] Unexpected error:', err)
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return supabaseResponse
}
