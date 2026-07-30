import { useCallback, useEffect, useState } from 'react'

/**
 * Success and error state for a form, with an optional cooldown the visitor cannot escape by
 * reloading or opening another tab. Passing a storage key persists the deadline, so a rate limit
 * survives a refresh; leaving it out keeps everything in memory.
 */
export function useStatusTimer(storageKey?: string) {
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expiresAt, setExpiresAt] = useState<number | null>(null)
  const [now, setNow] = useState(() => Date.now())
  /** Derived from a ticking now rather than stored, so the count cannot drift from the deadline */
  const countdown = expiresAt ? Math.max(0, Math.ceil((expiresAt - now) / 1000)) : 0
  const timerStorageKey = storageKey ? `status-timer-${storageKey}` : null

  useEffect(() => {
    if (!expiresAt) return

    const interval = setInterval(() => setNow(Date.now()), 1000)

    return () => clearInterval(interval)
  }, [expiresAt])

  useEffect(() => {
    if (!timerStorageKey) return

    const syncFromStorage = (valueStr: string | null) => {
      if (valueStr) {
        try {
          const stored = JSON.parse(valueStr)
          /** A deadline that has already passed is cleared rather than restored */
          if (stored.expiresAt && stored.expiresAt > Date.now()) {
            setNow(Date.now())
            setExpiresAt(stored.expiresAt)
            setSuccess(!!stored.success)
            setError(stored.error || null)
            return
          }

          try {
            if (timerStorageKey) localStorage.removeItem(timerStorageKey)
          } catch {}
        } catch {}
      }

      setExpiresAt(null)
      setSuccess(false)
      setError(null)
      setNow(Date.now())
    }

    try {
      syncFromStorage(timerStorageKey ? localStorage.getItem(timerStorageKey) : null)
    } catch {
      syncFromStorage(null)
    }

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === timerStorageKey) {
        syncFromStorage(e.newValue)
      }
    }

    window.addEventListener('storage', handleStorageEvent)
    return () => window.removeEventListener('storage', handleStorageEvent)
  }, [timerStorageKey])

  useEffect(() => {
    if (!expiresAt) return

    const timeout = setTimeout(
      () => {
        setSuccess(false)
        setError(null)
        setExpiresAt(null)
        try {
          if (timerStorageKey) localStorage.removeItem(timerStorageKey)
        } catch {}
      },
      Math.max(0, expiresAt - Date.now()),
    )

    return () => clearTimeout(timeout)
  }, [expiresAt, timerStorageKey])

  const persistState = useCallback(
    (sec: number, isSuccess: boolean, errMsg: string | null) => {
      setNow(Date.now())

      if (sec <= 0) {
        setExpiresAt(null)
        try {
          if (timerStorageKey) localStorage.removeItem(timerStorageKey)
        } catch {}
        return
      }

      const expires = Date.now() + sec * 1000
      setExpiresAt(expires)
      try {
        if (timerStorageKey) {
          localStorage.setItem(
            timerStorageKey,
            JSON.stringify({
              expiresAt: expires,
              success: isSuccess,
              error: errMsg,
            }),
          )
        }
      } catch {
        return
      }
    },
    [timerStorageKey],
  )

  const startCountdown = useCallback(
    (seconds: number) => {
      setSuccess(true)
      setError(null)
      persistState(seconds, true, null)
    },
    [persistState],
  )

  const showError = useCallback(
    (message: string, cooldownSeconds: number = 0) => {
      setSuccess(false)
      setError(message)
      persistState(cooldownSeconds, false, message)
    },
    [persistState],
  )

  const resetStatus = useCallback(() => {
    setSuccess(false)
    setError(null)
    setExpiresAt(null)
    setNow(Date.now())
    try {
      if (timerStorageKey) localStorage.removeItem(timerStorageKey)
    } catch {}
  }, [timerStorageKey])

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
