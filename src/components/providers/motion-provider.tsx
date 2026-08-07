'use client'

import { domMax, LazyMotion, MotionConfig } from 'framer-motion'
import type { ReactNode } from 'react'

/** Loads framer's features on demand, so the animation code is not in the first bundle */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domMax} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  )
}
