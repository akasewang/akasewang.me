'use client'

import { AnimatePresence, m, type Variants } from 'framer-motion'
import { type ReactNode, useState } from 'react'
import { PAGE_ENTER_TRANSITION, PAGE_EXIT_TRANSITION } from '@/constants/ui'
import { type CategoryTravel, resolveCategoryTravel } from '@/utils/category-transition'

/**
 * Where a panel comes from and leaves towards, read from the travel worked out beside this.
 *
 * The route's own variants at the scale of a panel: it slides in from the side it is travelling
 * from, arrives solid rather than fading up, and the one leaving fades as it goes. Both halves keep
 * the route's curves, so the movement is the same movement.
 *
 * PAGE_SLIDE_X is a share of the viewport because a page has to clear the screen to read as a page
 * leaving. A panel has only to clear itself, so the same rule here is its own width, and the
 * distance needs no measurement of its own.
 */
const PANEL_VARIANTS: Variants = {
  enter: ({ sign }: CategoryTravel) => ({ opacity: 1, x: `${sign * 100}%` }),
  center: { opacity: 1, x: 0, transition: PAGE_ENTER_TRANSITION },
  exit: ({ sign }: CategoryTravel) => ({
    opacity: 0,
    x: `${-sign * 100}%`,
    transition: PAGE_EXIT_TRANSITION,
  }),
}

interface CategoryTransitionProps {
  /** Whichever choice is showing. What is rendered swaps when this does */
  value: string
  /** The order the choices sit in, which is the whole of what gives the travel its direction */
  order: readonly string[]
  className?: string
  children: ReactNode
}

/**
 * Carries whatever a filter is filtering, so changing the choice moves the way changing a page does.
 *
 * Kept apart from the filters themselves, which only pick: a row of chips and the thing beneath it
 * are two jobs, and separating them is what lets a filter be used with this or without it. Both the
 * skeleton preview's own filter and the one inside it use this; the filters elsewhere on the site
 * do not, and are unaffected by it existing.
 *
 * Children are keyed on the value, so each change mounts them afresh rather than reconciling one
 * into the next. For a skeleton that is the point: its pulses start together instead of picking up
 * mid cycle from the one before.
 */
export function CategoryTransition({ value, order, className, children }: CategoryTransitionProps) {
  /**
   * Settled while rendering the change rather than after it, the way PageTransition resolves its
   * own travel, so the arriving panel knows its direction on the first frame it is drawn.
   */
  const [entry, setEntry] = useState<{ value: string; travel: CategoryTravel }>({
    value,
    travel: { sign: 1 },
  })

  if (entry.value !== value) {
    setEntry({ value, travel: resolveCategoryTravel(entry.value, value, order) })
  }

  return (
    /** initial={false} is the route's opening case: the first panel is already in place */
    <AnimatePresence mode="wait" custom={entry.travel} initial={false}>
      <m.div
        key={value}
        custom={entry.travel}
        variants={PANEL_VARIANTS}
        initial="enter"
        animate="center"
        exit="exit"
        className={className}
      >
        {children}
      </m.div>
    </AnimatePresence>
  )
}
