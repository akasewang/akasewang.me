'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

export function RouteScrollReset() {
  const pathname = usePathname()
  const previousPath = useRef<string | null>(null)
  const isRestoring = useRef(false)

  useEffect(() => {
    const markRestore = () => {
      if (window.location.pathname !== previousPath.current) isRestoring.current = true
    }

    window.addEventListener('popstate', markRestore)
    return () => window.removeEventListener('popstate', markRestore)
  }, [])

  useEffect(() => {
    const isFirstRender = previousPath.current === null
    const hasMoved = previousPath.current !== pathname
    previousPath.current = pathname

    const restoring = isRestoring.current
    isRestoring.current = false

    if (isFirstRender || !hasMoved || restoring || window.location.hash) return

    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return null
}
