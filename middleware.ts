import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Set to true to skip auth (for local development)
const SKIP_AUTH = false

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
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  // If Supabase is not configured, allow access
  if (!supabaseUrl || !supabaseAnonKey) {
    return withSecurityHeaders(NextResponse.next())
  }

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (SKIP_AUTH) {
      console.log('[Middleware] SKIP_AUTH enabled - allowing access')
      return withSecurityHeaders(NextResponse.next())
    }

    let supabaseResponse = NextResponse.next({
      request: { headers: request.headers },
    })

    try {
      // Create Supabase client with proper cookie handling
      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }: { name: string; value: string; options?: any }) =>
              supabaseResponse.cookies.set(name, value, options)
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
        userId: user?.id,
        userEmail: user?.email,
        authError: authError?.message,
        path: request.nextUrl.pathname 
      })

      if (authError || !user) {
        console.log('[Middleware] No authenticated user - redirecting to login')
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        url.searchParams.set('redirect', request.nextUrl.pathname)
        return withSecurityHeaders(NextResponse.redirect(url))
      }

      // Use service role key to bypass RLS for role check
      const adminClient = createServerClient(supabaseUrl, supabaseServiceKey!, {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet: Array<{name: string; value: string; options?: any}>) {
            cookiesToSet.forEach(({ name, value, options }: {name: string; value: string; options?: any}) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      })

      // Try to find user role
      let role: string | null = null

      // First check users table
      const { data: userRow, error: usersError } = await adminClient
        .from('users')
        .select('role, email')
        .eq('id', user.id)
        .maybeSingle()

      console.log('[Middleware] Users table check:', { 
        found: !!userRow, 
        role: userRow?.role,
        error: usersError?.message 
      })

      if (userRow?.role) {
        role = userRow.role
      } else {
        // Try user_profiles table
        const { data: profileRow, error: profileError } = await adminClient
          .from('user_profiles')
          .select('role, username')
          .eq('id', user.id)
          .maybeSingle()

        console.log('[Middleware] Profiles table check:', { 
          found: !!profileRow, 
          role: profileRow?.role,
          error: profileError?.message 
        })

        if (profileRow?.role) {
          role = profileRow.role
        }
      }

      // Bootstrap: Create first admin user if no users exist
      if (!role) {
        console.log('[Middleware] No role found, checking if first user...')
        
        const { count: usersCount, error: countError } = await adminClient
          .from('users')
          .select('*', { count: 'exact', head: true })

        console.log('[Middleware] Total users count:', usersCount, 'Error:', countError?.message)

        if (usersCount === 0 || usersCount === null) {
          console.log('[Middleware] Creating first admin user...')
          
          // Create in users table
          const { data: newUser, error: insertError } = await adminClient
            .from('users')
            .upsert({
              id: user.id,
              email: user.email,
              full_name: user.email?.split('@')[0] || 'Admin',
              role: 'admin',
            }, {
              onConflict: 'id'
            })
            .select()
            .single()

          if (insertError) {
            console.error('[Middleware] Error creating user in users table:', insertError)
          } else {
            console.log('[Middleware] Created user in users table:', newUser)
            role = 'admin'
          }

          // Also create in user_profiles table
          const { data: newProfile, error: profileInsertError } = await adminClient
            .from('user_profiles')
            .upsert({
              id: user.id,
              username: user.email?.split('@')[0] || 'admin',
              full_name: user.email?.split('@')[0] || 'Admin',
              role: 'admin',
              language: 'bg',
            }, {
              onConflict: 'id'
            })
            .select()
            .single()

          if (profileInsertError) {
            console.error('[Middleware] Error creating profile:', profileInsertError)
          } else {
            console.log('[Middleware] Created profile:', newProfile)
          }
        } else {
          console.log('[Middleware] Users exist but no role found for this user - creating as regular user')
          
          // Create user but not as admin (not first user)
          await adminClient.from('users').upsert({
            id: user.id,
            email: user.email,
            full_name: user.email?.split('@')[0] || 'User',
            role: 'user',
          }, { onConflict: 'id' })

          await adminClient.from('user_profiles').upsert({
            id: user.id,
            username: user.email?.split('@')[0] || 'user',
            full_name: user.email?.split('@')[0] || 'User',
            role: 'user',
            language: 'bg',
          }, { onConflict: 'id' })

          role = 'user'
        }
      }

      console.log('[Middleware] Final role check:', { role, userId: user.id, email: user.email })

      if (!role || !['admin', 'editor', 'moderator'].includes(role)) {
        console.warn('[Middleware] Access denied - invalid role:', role)
        return withSecurityHeaders(
          NextResponse.redirect(new URL('/', request.url))
        )
      }

      console.log('[Middleware] ✅ Access granted for', user.email, 'with role:', role)
      return withSecurityHeaders(supabaseResponse)

    } catch (error) {
      console.error('[Middleware] Unexpected error:', error)
      // On error, redirect to home
      return withSecurityHeaders(
        NextResponse.redirect(new URL('/', request.url))
      )
    }
  }

  return withSecurityHeaders(NextResponse.next())
}

export const config = {
  matcher: ['/admin/:path*'],
}
