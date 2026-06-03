import { useState, useEffect, useCallback } from 'react'

/**
 * Custom hook for managing time-based status states (success/error) with automatic cooldown and countdown timers.
 * Useful for handling temporary UI states like "Copied to clipboard" or rate-limiting error messages.
 *
 * @param {string} [storageKey] - Optional key to persist the countdown in localStorage across navigations.
 * @returns {object} An object containing success/error states, the current countdown value, and methods to trigger them.
 */
export function useStatusTimer(storageKey?: string) {
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expiresAt, setExpiresAt] = useState<number | null>(null)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    if (!storageKey) return

    const syncFromStorage = (valueStr: string | null) => {
      if (valueStr) {
        try {
          const stored = JSON.parse(valueStr)
          if (stored.expiresAt && stored.expiresAt > Date.now()) {
            setExpiresAt(stored.expiresAt)
            setSuccess(!!stored.success)
            setError(stored.error || null)
            return
          } else {
            localStorage.removeItem(`status-timer-${storageKey}`)
          }
        } catch (e) {}
      }
      
      setExpiresAt(null)
      setSuccess(false)
      setError(null)
    }

    syncFromStorage(localStorage.getItem(`status-timer-${storageKey}`))

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === `status-timer-${storageKey}`) {
        syncFromStorage(e.newValue)
      }
    }

    window.addEventListener('storage', handleStorageEvent)
    return () => window.removeEventListener('storage', handleStorageEvent)
  }, [storageKey])

  useEffect(() => {
    if (!expiresAt) {
      setCountdown(0)
      return
    }

    const tick = () => {
      const now = Date.now()
      if (expiresAt > now) {
        setCountdown(Math.ceil((expiresAt - now) / 1000))
      } else {
        setCountdown(0)
        setSuccess(false)
        setError(null)
        setExpiresAt(null)
        if (storageKey) localStorage.removeItem(`status-timer-${storageKey}`)
      }
    }

    tick()
    const interval = setInterval(tick, 1000)

    return () => clearInterval(interval)
  }, [expiresAt, storageKey])

  const persistState = useCallback((sec: number, isSuccess: boolean, errMsg: string | null) => {
    const expires = Date.now() + sec * 1000
    setExpiresAt(expires)
    if (storageKey && sec > 0) {
      localStorage.setItem(`status-timer-${storageKey}`, JSON.stringify({
        expiresAt: expires,
        success: isSuccess,
        error: errMsg
      }))
    }
  }, [storageKey])

  const startCountdown = useCallback((seconds: number) => {
    setSuccess(true)
    setError(null)
    persistState(seconds, true, null)
  }, [persistState])

  const showError = useCallback((message: string, cooldownSeconds: number = 0) => {
    setSuccess(false)
    setError(message)
    persistState(cooldownSeconds, false, message)
  }, [persistState])

  const resetStatus = useCallback(() => {
    setSuccess(false)
    setError(null)
    setExpiresAt(null)
    setCountdown(0)
    if (storageKey) localStorage.removeItem(`status-timer-${storageKey}`)
  }, [storageKey])

  return {
    success,
    setSuccess,
    error,
    setError,
    countdown,
    startCountdown,
    showError,
    resetStatus,
  }
}