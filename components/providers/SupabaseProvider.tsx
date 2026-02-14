'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { SupabaseClient } from '@supabase/supabase-js'

const SupabaseContext = createContext<SupabaseClient | null>(null)

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createClient())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Handle auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        // Clear any cached data
        window.location.href = '/'
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  if (!mounted) {
    return null
  }

  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  )
}

export function useSupabase() {
  const context = useContext(SupabaseContext)
  if (!context) {
    throw new Error('useSupabase must be used within SupabaseProvider')
  }
  return context
}
