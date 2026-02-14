/**
 * Checks if an error is an AbortError (typically thrown when a request is cancelled)
 * This is normal behavior when components unmount before async operations complete
 */
export function isAbortError(error: any): boolean {
  return (
    error?.name === 'AbortError' ||
    error?.message?.includes('aborted') ||
    error?.message?.includes('signal is aborted')
  )
}

/**
 * Safely handles errors, ignoring AbortErrors which are expected during component unmount
 */
export function handleAsyncError(error: any, context?: string): void {
  if (isAbortError(error)) {
    // Silently ignore abort errors - they're expected when components unmount
    return
  }
  
  if (context) {
    console.error(`[${context}] Error:`, error)
  } else {
    console.error('Error:', error)
  }
}
