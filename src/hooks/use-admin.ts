'use client'

import { useCallback, useEffect, useState } from 'react'
import { checkAdminSession, signInAdmin, signOutAdmin } from '@/lib/actions/admin-session-actions'

/** storage only fires in other tabs, so same tab listeners need an event of their own */
const TOGGLE_EVENT = 'adminModeToggled'

/**
 * Mirrors whether a session is open across every component and tab. It holds a flag and nothing
 * else: the session lives in an httpOnly cookie the browser cannot read, so there is no credential
 * here to steal or forge, and every privileged action checks the cookie again for itself.
 */
export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    let active = true

    const syncState = () => {
      checkAdminSession()
        .then((open) => {
          if (active) setIsAdmin(open)
        })
        .catch(() => {
          if (active) setIsAdmin(false)
        })
    }

    syncState()
    window.addEventListener(TOGGLE_EVENT, syncState)
    /** The cookie can expire or be signed out elsewhere while the tab sits idle */
    window.addEventListener('focus', syncState)

    return () => {
      active = false
      window.removeEventListener(TOGGLE_EVENT, syncState)
      window.removeEventListener('focus', syncState)
    }
  }, [])

  /** Both of these announce the change so every other copy of the hook in this tab re-syncs */
  const loginAdmin = useCallback(async (code: string) => {
    const result = await signInAdmin(code)
    setIsAdmin(result.success)
    window.dispatchEvent(new Event(TOGGLE_EVENT))
    return result
  }, [])

  const logoutAdmin = useCallback(async () => {
    await signOutAdmin()
    setIsAdmin(false)
    window.dispatchEvent(new Event(TOGGLE_EVENT))
  }, [])

  return { isAdmin, loginAdmin, logoutAdmin }
}
