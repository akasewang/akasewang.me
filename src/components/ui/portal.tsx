'use client'

import { type ReactNode, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'

const subscribe = () => () => {}
const getClientSnapshot = () => true
const getServerSnapshot = () => false

export function Portal({ children }: { children: ReactNode }) {
  const mounted = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot)

  return mounted ? createPortal(children, document.body) : null
}
