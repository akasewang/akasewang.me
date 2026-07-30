'use client'

import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'adminKey'
/** storage only fires in other tabs, so same tab listeners need an event of their own */
const TOGGLE_EVENT = 'adminModeToggled'

/**
 * Mirrors the stored admin credential across every component and tab. This only decides what the
 * UI offers: Server Actions revalidate the credential on each privileged mutation, so a forged
 * value here buys nothing.
 */
export function useAdmin() {
  const [adminKey, setAdminKey] = useState<string | null>(null)

  useEffect(() => {
    const syncState = () => {
      try {
        setAdminKey(localStorage.getItem(STORAGE_KEY))
      } catch {
        setAdminKey(null)
      }
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setAdminKey(e.newValue)
      }
    }

    syncState()

    window.addEventListener(TOGGLE_EVENT, syncState)
    window.addEventListener('storage', handleStorage)

    return () => {
      window.removeEventListener(TOGGLE_EVENT, syncState)
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  const loginAdmin = useCallback((key: string) => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(STORAGE_KEY, key)
      setAdminKey(key)
    } catch {
      setAdminKey(null)
    }
    window.dispatchEvent(new Event(TOGGLE_EVENT))
  }, [])

  const logoutAdmin = useCallback(() => {
    if (typeof window === 'undefined') return
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {}
    setAdminKey(null)
    window.dispatchEvent(new Event(TOGGLE_EVENT))
  }, [])

  return { adminKey, loginAdmin, logoutAdmin }
}
