'use client'

import { AnimatePresence, m, type Transition, type Variants } from 'framer-motion'
import { Children, type ElementType, type ReactNode, useEffect, useState } from 'react'
import { SMOOTH_SPRING_TRANSITION } from '@/constants/ui'
import { usePageArriving } from '@/hooks/use-page-arrival'
import { cn } from '@/utils/utils'

/** The outgoing line leaves upward and the next rises after it, so the two read as one movement */
const defaultVariants: Variants = {
  initial: { y: 20, opacity: 0, filter: 'blur(4px)' },
  animate: { y: 0, opacity: 1, filter: 'blur(0px)' },
  exit: { y: -20, opacity: 0, filter: 'blur(4px)' },
}

interface TextFlipProps {
  as?: ElementType
  className?: string
  children: ReactNode
  interval?: number
  transition?: Transition
  variants?: Variants
}

/**
 * Cycles through its children one at a time, swapping them on a timer.
 *
 * Each child is keyed by its position, which is what tells framer the old one is leaving and a new
 * one arriving rather than the same element changing its text. Width is animated too, so a shorter
 * line does not snap the words beside it, though that is left off while a page is still sliding in,
 * where the measurements it works from are of a layout that has not settled.
 *
 * A single child simply sits there, with no timer started.
 */
export function TextFlip({
  as: Component = m.span,
  className,
  children,
  interval = 3,
  transition = SMOOTH_SPRING_TRANSITION,
  variants = defaultVariants,
}: TextFlipProps) {
  const isArriving = usePageArriving()
  const [currentIndex, setCurrentIndex] = useState(0)

  const items = Children.toArray(children)

  useEffect(() => {
    if (items.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length)
    }, interval * 1000)

    return () => clearInterval(timer)
  }, [items.length, interval])

  if (items.length === 0) return null

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <Component
        key={currentIndex}
        layout={!isArriving ? 'position' : false}
        className={cn('inline-block', className)}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={transition}
        variants={variants}
      >
        {items[currentIndex]}
      </Component>
    </AnimatePresence>
  )
}
