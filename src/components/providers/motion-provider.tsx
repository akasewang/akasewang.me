'use client'

import { LazyMotion, domMax } from 'framer-motion'
import { ReactNode } from 'react'

/**
 * Global provider for Framer Motion's LazyMotion feature.
 * Injects the `domMax` animation engine into the app at the root level, allowing all child
 * components to use the lightweight `m` component (e.g. `m.div`) instead of `motion.div`.
 * This prevents the heavy Framer Motion bundle from being included in the initial load,
 * while still supporting advanced features like `layout` and `layoutId`.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domMax} strict>
      {children}
    </LazyMotion>
  )
}