import { useEffect } from 'react'

/**
 * Utility hook that prevents body scrolling when a modal or overlay is open.
 * Sets the document body overflow to hidden. Layout shifts are natively prevented
 *
 * @param isOpen - Boolean indicating whether the scroll lock should be currently active.
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
