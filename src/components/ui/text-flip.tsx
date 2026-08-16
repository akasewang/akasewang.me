'use client'

import { AnimatePresence, m, type Transition, useReducedMotion, type Variants } from 'framer-motion'
import { Children, type ElementType, type Key, type ReactNode, useEffect, useState } from 'react'
import { SMOOTH_SPRING_TRANSITION } from '@/constants/ui'
import { usePageArriving } from '@/hooks/use-page-arrival'
import { cn } from '@/utils/utils'

/** The outgoing line leaves upward and the next rises after it, so the two read as one movement */
const defaultVariants: Variants = {
  initial: { y: 20, opacity: 0, filter: 'blur(4px)' },
  animate: { y: 0, opacity: 1, filter: 'blur(0px)' },
  exit: { y: -20, opacity: 0, filter: 'blur(4px)' },
}

/** A full-height flip for clipped labels in compact controls such as buttons and command hints */
export const TEXT_FLIP_SWAP_VARIANTS: Variants = {
  initial: { y: '110%' },
  animate: { y: '0%' },
  exit: { y: '-110%' },
}

interface TextFlipProps {
  activeKey?: Key
  as?: ElementType
  className?: string
  children: ReactNode
  interval?: number
  layout?: boolean | 'position' | 'size' | 'preserve-aspect'
  transition?: Transition
  variants?: Variants
}

/**
 * Flips changing text vertically. With an activeKey it follows controlled content; otherwise it
 * cycles through its children on a timer.
 *
 * Each child is keyed by its position, which is what tells framer the old one is leaving and a new
 * one arriving rather than the same element changing its text. Width is animated too, so a shorter
 * line does not snap the words beside it, though that is left off while a page is still sliding in,
 * where the measurements it works from are of a layout that has not settled.
 *
 * A single child simply sits there, with no timer started.
 */
export function TextFlip({
  activeKey,
  as: Component = m.span,
  className,
  children,
  interval = 3,
  layout = 'position',
  transition = SMOOTH_SPRING_TRANSITION,
  variants = defaultVariants,
}: TextFlipProps) {
  const isArriving = usePageArriving()
  const reduceMotion = useReducedMotion()
  const [currentIndex, setCurrentIndex] = useState(0)

  /** Given an activeKey the caller drives the swap, otherwise it cycles its children on a timer */
  const items = Children.toArray(children)
  const isControlled = activeKey !== undefined

  useEffect(() => {
    if (isControlled || items.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length)
    }, interval * 1000)

    return () => clearInterval(timer)
  }, [isControlled, items.length, interval])

  if (items.length === 0) return null

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <Component
        key={isControlled ? activeKey : currentIndex}
        layout={!isArriving && !reduceMotion ? layout : false}
        className={cn('inline-block', className)}
        initial={reduceMotion ? false : 'initial'}
        animate={reduceMotion ? undefined : 'animate'}
        exit={reduceMotion ? undefined : 'exit'}
        transition={transition}
        variants={variants}
      >
        {isControlled ? children : items[currentIndex]}
      </Component>
    </AnimatePresence>
  )
}
