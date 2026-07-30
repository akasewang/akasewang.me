'use client'

import { domMax, LazyMotion, MotionConfig } from 'framer-motion'
import type { ReactNode } from 'react'

/**
 * reducedMotion user drops every positional value app wide, transforms and layout plus width and
 * height, leaving fades and colour to still play. Components do not check the preference themselves.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domMax} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  )
}
