'use client'

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Ignore AbortError from Supabase locks
    if (error.name === 'AbortError' || error.message?.includes('signal is aborted')) {
      console.warn('Supabase AbortError ignored (known issue in dev mode)')
      this.setState({ hasError: false })
      return
    }

    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // Ignore AbortError
      if (this.state.error?.name === 'AbortError') {
        return this.props.children
      }

      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Нещо се обърка</h2>
            <p className="text-muted-foreground mb-4">
              Моля, опреснете страницата
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Опресни страницата
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
