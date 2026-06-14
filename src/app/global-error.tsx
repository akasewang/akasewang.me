'use client'

import { useEffect } from 'react'

/**
 * Global error boundary for failures in the root layout itself. It replaces the whole shell, so it
 * renders its own `<html>` and `<body>` with inline styles since the global stylesheet is not loaded.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: '#0a0a0a',
          color: '#fafafa',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>Something went wrong</h1>
        <p style={{ margin: 0, color: '#a3a3a3' }}>A critical error occurred. Please try again.</p>
        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: '0.5rem',
            padding: '0.5rem 1.25rem',
            borderRadius: '0.75rem',
            border: '1px solid #2a2a2a',
            backgroundColor: '#fafafa',
            color: '#0a0a0a',
            fontSize: '0.875rem',
            cursor: 'pointer',
          }}
        >
          Try again
        </button>
      </body>
    </html>
  )
}
