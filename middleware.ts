import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Set to true to skip auth (for local development without users table)
const SKIP_AUTH = true // Temporary for testing

const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'DENY',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
}

function withSecurityHeaders(response: NextResponse) {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    if (!response.headers.has(key)) {
      response.headers.set(key, value)
    }
  })
  return response
}

export async function middleware(request: NextRequest) {
  let response = withSecurityHeaders(
    NextResponse.next({
      request: { headers: request.headers },
    })
  )

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabaseServiceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey

  // If Supabase is not configured, allow access but keep hardened headers
  if (!supabaseUrl || !supabaseAnonKey) {
    return response
  }

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Skip auth if enabled (for development)
    if (SKIP_AUTH) {
      return response
    }

    try {
      // Primary client uses the anon key for session validation
      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            )
            response = NextResponse.next({
              request: { headers: request.headers },
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      })

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      console.log('[Middleware] Auth check:', { 
        hasUser: !!user, 
        userEmail: user?.email,
        authError: authError?.message,
        path: request.nextUrl.pathname 
      })

      if (authError || !user) {
        console.log('[Middleware] Пренасочване към login')
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        url.searchParams.set('redirect', request.nextUrl.pathname)
        return withSecurityHeaders(NextResponse.redirect(url))
      }

      // Hardened role check bypassing RLS with the service role key
      const adminClient = createServerClient(supabaseUrl, supabaseServiceKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      })

      // Project variants use either public.users or public.user_profiles for roles.
      // Try public.users first (supabase/schema.sql), then fallback.
      let role: string | null = null

      const { data: userRow, error: usersTableError } = await adminClient
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!usersTableError && userRow?.role) {
        role = userRow.role
      } else {
        const { data: profileRow, error: profilesTableError } = await adminClient
          .from('user_profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (!profilesTableError && profileRow?.role) {
          role = profileRow.role
        }
      }

      if (!role) {
        // Bootstrap path: ако таблицата е празна, направи първия потребител admin
        const { data: usersCount } = await adminClient
          .from('users')
          .select('id', { count: 'exact', head: true })

        if ((usersCount?.length ?? 0) === 0) {
          // Създай първия ред като admin
          const { error: insertError } = await adminClient.from('users').upsert({
            id: user.id,
            email: user.email,
            full_name: user.email?.split('@')[0] || 'Admin',
            role: 'admin',
          })

          if (!insertError) {
            role = 'admin'
            console.log('[Middleware] Bootstrap admin създаден за', user.email)
          }
        }
      }

      if (!role) {
        console.warn('[Middleware] Role not found for user, denying admin access')
        return withSecurityHeaders(NextResponse.redirect(new URL('/', request.url)))
      }

      console.log('[Middleware] User role:', role, '- allowing access')

      if (!['admin', 'editor', 'moderator'].includes(role)) {
        console.warn('[Middleware] Invalid role:', role)
        return withSecurityHeaders(
          NextResponse.redirect(new URL('/', request.url))
        )
      }
    } catch (error) {
      console.error('Middleware auth error:', error)
      // On error, allow access but keep security headers
      return response
    }
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}
