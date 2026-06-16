import { useEffect } from 'react'

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
