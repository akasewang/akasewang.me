'use client'

import { type HTMLMotionProps, m } from 'framer-motion'
import { SPRING_TRANSITION } from '@/constants/ui'

export function AnimatedListItem(props: HTMLMotionProps<'div'>) {
  return (
    <m.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={SPRING_TRANSITION}
      {...props}
    />
  )
}
