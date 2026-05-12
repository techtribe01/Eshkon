'use client'

import React from 'react'

interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error) {
    console.error(error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full border-t border-border bg-surface px-6 py-4">
          <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-red-500"
            >
              <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 5v3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="8" cy="10.5" r="0.75" fill="currentColor" />
            </svg>
            <div>
              <p className="text-sm font-medium text-red-700">
                Section failed to render
              </p>
              {this.state.error?.message ? (
                <p className="mt-0.5 font-mono text-xs text-red-500">
                  {this.state.error.message}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
