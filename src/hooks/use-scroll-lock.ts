import { useEffect } from 'react'

/**
 * Locks body scrolling while `isOpen` is true (e.g. for a modal or overlay) by setting
 * `overflow: hidden` on the document body and restores the previous overflow on cleanup.
 *
 * @param isOpen - Whether the scroll lock should currently be active.
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
