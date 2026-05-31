import { useState, useEffect, useCallback } from 'react'

/**
 * Custom hook for managing time-based status states (success/error) with automatic cooldown and countdown timers.
 * Useful for handling temporary UI states like "Copied to clipboard" or rate-limiting error messages.
 *
 * @returns {object} An object containing success/error states, the current countdown value, and methods to trigger them.
 */
export function useStatusTimer() {
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    if (countdown <= 0) return

    const timer = setTimeout(() => {
      if (countdown === 1) {
        setSuccess(false)
        setError(null)
      }
      setCountdown((prev) => prev - 1)
    }, 1000)

    /**
     * Cleanup function strictly guarantees that the timeout is cleared if the component unmounts
     * Prevents memory leaks and state updates on unmounted components when the countdown changes.
     */
    return () => clearTimeout(timer)
  }, [countdown])

  const startCountdown = useCallback((seconds: number) => {
    setSuccess(true)
    setError(null)
    setCountdown(seconds)
  }, [])

  const showError = useCallback((message: string, cooldownSeconds: number = 0) => {
    setSuccess(false)
    setError(message)
    setCountdown(cooldownSeconds)
  }, [])

  const resetStatus = useCallback(() => {
    setSuccess(false)
    setError(null)
    setCountdown(0)
  }, [])

  return {
    success,
    setSuccess,
    error,
    setError,
    countdown,
    setCountdown,
    startCountdown,
    showError,
    resetStatus,
  }
}
