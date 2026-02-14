// Global error handler for suppressing known issues
if (typeof window !== 'undefined') {
  // Suppress Supabase AbortError
  window.addEventListener('unhandledrejection', (event) => {
    if (
      event.reason?.name === 'AbortError' ||
      event.reason?.message?.includes('signal is aborted') ||
      event.reason?.message?.includes('@supabase/auth-js')
    ) {
      console.warn('Suppressed Supabase AbortError (known dev mode issue)')
      event.preventDefault()
    }
  })

  // Suppress console errors for AbortError
  const originalConsoleError = console.error
  console.error = function (...args) {
    const message = args[0]?.toString?.() || ''
    if (
      message.includes('AbortError') ||
      message.includes('signal is aborted') ||
      message.includes('@supabase/auth-js/dist/module/lib/locks')
    ) {
      // Suppress this error
      return
    }
    originalConsoleError.apply(console, args)
  }
}
