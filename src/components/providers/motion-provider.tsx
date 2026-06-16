'use client'

import { domMax, LazyMotion } from 'framer-motion'
import type { ReactNode } from 'react'

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domMax} strict>
      {children}
    </LazyMotion>
  )
}
