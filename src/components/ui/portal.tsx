'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

/**
 * A utility component that safely mounts its children into `document.body` using React Portals.
 * Delays rendering until after the component has mounted on the client to prevent hydration mismatches.
 */
export function Portal({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return mounted ? createPortal(children, document.body) : null
}
