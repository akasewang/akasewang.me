'use client'

import { Children, useEffect, useState, type ElementType, type ReactNode } from 'react'
import { AnimatePresence, motion, type Transition, type Variants } from 'framer-motion'
import { cn } from '@/utils/utils'
import { SMOOTH_SPRING_TRANSITION } from '@/constants/ui'

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
 * @param as - The HTML element or Framer Motion component to render as (defaults to `motion.span`).
 * @param interval - Time in seconds between each flip.
 * @param transition - Custom Framer Motion transition config.
 * @param variants - Custom Framer Motion variants for the entrance/exit animations.
 */
export function TextFlip({
  as: Component = motion.span,
  className,
  children,
  interval = 3,
  transition = SMOOTH_SPRING_TRANSITION,
  variants = defaultVariants,
}: TextFlipProps) {
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
        layout
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
