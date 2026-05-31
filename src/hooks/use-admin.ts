'use client'

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'adminKey'
const TOGGLE_EVENT = 'adminModeToggled'

/**
 * Hook for managing client-side admin authentication state via `localStorage`.
 * Synchronizes the admin state across multiple browser tabs using `storage` events.
 * Synchronizes state within the same tab using custom `adminModeToggled` events.
 *
 * @returns {object} An object containing the current `adminKey` and methods to login/logout.
 */
export function useAdmin() {
  const [adminKey, setAdminKey] = useState<string | null>(null)

  useEffect(() => {
    const syncState = () => setAdminKey(localStorage.getItem(STORAGE_KEY))

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setAdminKey(e.newValue)
      }
    }

    syncState()

    /**
     * Dual event listener strategy:
     * - `adminModeToggled` is a custom event used to sync state across components within the *same* browser tab.
     * - `storage` is a native browser event that automatically syncs state across *different* browser tabs.
     */
    window.addEventListener(TOGGLE_EVENT, syncState)
    window.addEventListener('storage', handleStorage)

    return () => {
      window.removeEventListener(TOGGLE_EVENT, syncState)
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  const loginAdmin = useCallback((key: string) => {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEY, key)
    window.dispatchEvent(new Event(TOGGLE_EVENT))
  }, [])

  const logoutAdmin = useCallback(() => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(STORAGE_KEY)
    window.dispatchEvent(new Event(TOGGLE_EVENT))
  }, [])

  return { adminKey, loginAdmin, logoutAdmin }
}
