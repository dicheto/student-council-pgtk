'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, Lock, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showSignup, setShowSignup] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const supabase = createClient()
      
      console.log('[Signup] Създаване на потребител:', email)
      
      // Sign up the user
      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: email.split('@')[0],
          },
        },
      })

      if (signupError) {
        console.error('[Signup] Грешка:', signupError)
        setError(signupError.message)
        setIsLoading(false)
        return
      }

      if (data.user) {
        console.log('[Signup] Потребител създаден:', data.user.email)
        
        // Manually insert user into users table (as fallback if trigger doesn't work)
        try {
          const { data: usersCount } = await supabase
            .from('users')
            .select('id', { count: 'exact', head: true })
          
          const isFirstUser = (usersCount as any)?.length === 0
          
          await supabase.from('users').upsert({
            id: data.user.id,
            email: data.user.email,
            full_name: email.split('@')[0],
            role: isFirstUser ? 'admin' : 'user',
          })
          
          await supabase.from('user_profiles').upsert({
            id: data.user.id,
            username: email.split('@')[0],
            full_name: email.split('@')[0],
            role: isFirstUser ? 'admin' : 'user',
            language: 'bg',
          })
          
          console.log('[Signup] User profile създаден manually')
        } catch (profileError) {
          console.error('[Signup] Profile creation error:', profileError)
        }
        
        // Check if email confirmation is required
        if (data.session) {
          // No email confirmation needed, redirect directly
          setError('Успешна регистрация! Пренасочване...')
          setTimeout(() => {
            window.location.href = '/admin'
          }, 1000)
        } else {
          // Email confirmation required
          setError('Регистрацията е успешна! Моля, проверете имейла си за потвърждение.')
          setIsLoading(false)
        }
      }
    } catch (err: any) {
      console.error('[Signup] Изключение:', err)
      setError(err.message || 'Грешка при регистрация')
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    if (showSignup) {
      return handleSignup(e)
    }
    
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const supabase = createClient()
      
      console.log('[Login] Опит за вход с:', email)
      
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        console.error('[Login] Auth грешка:', authError)
        console.log('[Login] Full error details:', JSON.stringify(authError, null, 2))
        
        // Show more detailed error message
        let errorMessage = authError.message
        
        if (authError.message.includes('Invalid login credentials')) {
          errorMessage = 'Грешен имейл или парола'
        } else if (authError.message.includes('Email not confirmed')) {
          errorMessage = 'Имейлът не е потвърден. Проверете входящата си поща.'
        } else if (authError.message.includes('User not found')) {
          errorMessage = 'Потребителят не съществува. Моля, регистрирайте се първо.'
        }
        
        setError(errorMessage + ' (Код: ' + authError.status + ')')
        return
      }

      console.log('[Login] Auth response:', { 
        hasUser: !!data.user, 
        hasSession: !!data.session,
        userEmail: data.user?.email,
        sessionAccessToken: data.session?.access_token?.substring(0, 20) + '...'
      })

      if (data.user) {
        if (!data.session) {
          console.warn('[Login] Потребител без session - може би трябва email confirmation')
          setError('Моля, потвърдете имейла си преди да влезете. Проверете входящата си поща.')
          return
        }
        
        console.log('[Login] Успешен login за:', data.user.email)
        const redirect = searchParams.get('redirect') || '/admin'
        console.log('[Login] Пренасочване към:', redirect)
        
        // Force hard navigation instead of router.push
        window.location.href = redirect
      }
    } catch (err: any) {
      console.error('[Login] Изключение:', err)
      setError(err.message || 'Грешка при влизане')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-primary-light/20 to-primary/10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
      >
        {/* Development Mode Notice */}
        <div className="mb-6 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-700 dark:text-yellow-400">
            <strong>Развиен режим:</strong> Можеш да отидеш директно на{' '}
            <a href="/admin" className="underline font-medium">/admin</a> без login
          </p>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {showSignup ? 'Регистрация' : 'Вход в системата'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Администраторски панел
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-3 border rounded-lg text-sm ${
                error.includes('Успешна') || error.includes('успешна')
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400'
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'
              }`}
            >
              {error}
            </motion.div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Имейл
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Парола
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="••••••••"
              />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {showSignup ? 'Регистрация...' : 'Влизане...'}
              </span>
            ) : (
              showSignup ? 'Регистрирай се' : 'Влез'
            )}
          </motion.button>
          
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => {
                setShowSignup(!showSignup)
                setError('')
              }}
              className="text-sm text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary transition-colors"
            >
              {showSignup ? 'Вече имаш акаунт? Влез' : 'Нямаш акаунт? Регистрирай се'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
