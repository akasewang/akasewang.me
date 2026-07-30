import { useEffect } from 'react'

/**
 * Holds the page still behind an overlay. The previous inline overflow is restored rather than
 * cleared, so a nested lock unwinding cannot release the one still holding it.
 */
export function useScrollLock(isOpen: boolean) {
  useEffect(() => {
    if (!isOpen) return

    const originalOverflow = document.body.style.overflow

    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [isOpen])
}
