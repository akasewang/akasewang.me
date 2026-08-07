'use client'

import { AnimatePresence, m, type Variants } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { type ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { NAV_AXIS } from '@/constants/navigation'
import {
  PAGE_ARRIVAL_TIMEOUT_MS,
  PAGE_ENTER_TRANSITION,
  PAGE_EXIT_TRANSITION,
  PAGE_REVEAL_TRANSITION,
  PAGE_SLIDE_X,
  PAGE_SLIDE_Y,
  REVEAL_ARRIVAL_TIMEOUT_MS,
  REVEAL_PAGE_LIFT,
} from '@/constants/ui'
import { PageArrivalContext } from '@/hooks/use-page-arrival'
import { getSiblingDirection } from '@/utils/route-direction'
import { flushScrollReset, markRouteChange, takeOverScrollRestoration } from '@/utils/route-scroll'
import { FrozenRouter } from './frozen-router'

/** A layout effect on the client, a plain one on the server, where layout effects do not run */
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

/** Which way a page moves: along which axis, in which direction, and whether this is the first load */
interface Travel {
  axis: 'x' | 'y'
  sign: number
  opening: boolean
}

/** Where a path sits in the navbar's running order, matching a section and everything beneath it */
const sectionIndexOf = (path: string) =>
  NAV_AXIS.findIndex((route) =>
    route === '/' ? path === '/' : path === route || path.startsWith(`${route}/`),
  )

/** 0 for a section's own page, 1 for anything inside it, which is what makes going in feel deeper */
const depthOf = (path: string) => (NAV_AXIS.some((route) => route === path) ? 0 : 1)

/**
 * Works out which way the page should travel, so movement matches where the visitor went.
 *
 * Moving between sections travels sideways in the order the navbar draws them, so a link to the
 * right of the current one arrives from the right. Moving into or out of a section travels
 * vertically instead, going down into a post and back up out of it. Between siblings, where
 * neither section nor depth changes, the direction is taken from whichever arrow was used.
 */
const resolveTravel = (from: string | null, to: string): Travel => {
  if (from === null) return { axis: 'y', sign: -1, opening: true }

  const fromIndex = sectionIndexOf(from)
  const toIndex = sectionIndexOf(to)

  if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
    return { axis: 'x', sign: toIndex > fromIndex ? 1 : -1, opening: false }
  }

  const depthDelta = depthOf(to) - depthOf(from)
  if (depthDelta !== 0) return { axis: 'y', sign: depthDelta > 0 ? 1 : -1, opening: false }

  if (fromIndex !== -1 && fromIndex === toIndex) {
    return { axis: 'x', sign: getSiblingDirection(), opening: false }
  }

  return { axis: 'x', sign: to > from ? 1 : -1, opening: false }
}

/**
 * Where a page waits, rests and leaves for, read from the travel worked out above.
 *
 * The first load is its own case: the page lifts into place under the opening curtain instead of
 * sliding in from an edge. Otherwise a page enters from the side it is travelling from and leaves
 * towards the opposite one, so the outgoing and incoming pages move together as one.
 */
const PAGE_VARIANTS: Variants = {
  enter: ({ axis, sign, opening }: Travel) =>
    opening
      ? { opacity: 0, x: 0, y: REVEAL_PAGE_LIFT }
      : {
          opacity: 1,
          x: axis === 'x' ? `${sign * PAGE_SLIDE_X}vw` : 0,
          y: axis === 'y' ? `${sign * PAGE_SLIDE_Y}vh` : 0,
        },
  center: ({ opening }: Travel) => ({
    opacity: 1,
    x: 0,
    y: 0,
    transition: opening ? PAGE_REVEAL_TRANSITION : PAGE_ENTER_TRANSITION,
  }),
  exit: ({ axis, sign }: Travel) => ({
    opacity: 0,
    x: axis === 'x' ? `${-sign * PAGE_SLIDE_X}vw` : 0,
    y: axis === 'y' ? `${-sign * PAGE_SLIDE_Y}vh` : 0,
    transition: PAGE_EXIT_TRANSITION,
  }),
}

/**
 * Puts the arriving page at the scroll position it should open at, once it is actually mounted.
 * Renders nothing, existing only to run at the point in the tree where that is true.
 */
function ArrivalScrollReset() {
  useEffect(flushScrollReset, [])

  return null
}

/**
 * Slides one page out while the next slides in, in the direction the visitor moved through the site.
 *
 * The route is compared against the previous one to decide that direction, and the outgoing page is
 * wrapped in FrozenRouter so it keeps rendering its own content while it leaves. Arrival is tracked
 * and published through PageArrivalContext, so anything that measures itself can sit still until
 * the page has stopped moving, and it is released on a timer as well in case the animation callback
 * that would normally clear it never lands.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const shellRef = useRef<HTMLDivElement>(null)
  const leavingRef = useRef(pathname)
  const [entry, setEntry] = useState(() => ({
    path: pathname,
    travel: resolveTravel(null, pathname),
  }))
  const [isArriving, setIsArriving] = useState(true)
  const [settledPath, setSettledPath] = useState<string | null>(null)

  if (entry.path !== pathname) {
    setEntry({ path: pathname, travel: resolveTravel(entry.path, pathname) })
    setIsArriving(true)
    setSettledPath(null)
  }

  useEffect(takeOverScrollRestoration, [])

  useIsomorphicLayoutEffect(() => {
    if (leavingRef.current === entry.path) return

    markRouteChange(leavingRef.current, entry.path)
    leavingRef.current = entry.path
  }, [entry.path])

  useEffect(() => {
    if (settledPath === null || settledPath !== entry.path) return

    const frame = requestAnimationFrame(() => setIsArriving(false))

    return () => cancelAnimationFrame(frame)
  }, [settledPath, entry.path])

  useEffect(() => {
    if (!isArriving) return

    const timer = setTimeout(
      () => setIsArriving(false),
      entry.travel.opening ? REVEAL_ARRIVAL_TIMEOUT_MS : PAGE_ARRIVAL_TIMEOUT_MS,
    )

    return () => clearTimeout(timer)
  }, [isArriving, entry.travel.opening])

  const isTravellingVertically = isArriving && entry.travel.axis === 'y' && !entry.travel.opening

  useIsomorphicLayoutEffect(() => {
    const shell = shellRef.current
    if (shell == null) return

    if (!isTravellingVertically) {
      shell.style.clipPath = ''
      return
    }

    let applied = ''

    const apply = () => {
      const top = -shell.getBoundingClientRect().top
      const next = `inset(${top}px -100vw calc(100% - ${top + window.innerHeight}px) -100vw)`

      if (next === applied) return
      applied = next
      shell.style.clipPath = next
    }

    apply()
    window.addEventListener('scroll', apply, { passive: true })
    window.addEventListener('resize', apply)

    return () => {
      window.removeEventListener('scroll', apply)
      window.removeEventListener('resize', apply)
      shell.style.clipPath = ''
    }
  }, [isTravellingVertically])

  return (
    <div ref={shellRef}>
      <AnimatePresence mode="wait" custom={entry.travel}>
        <m.div
          key={pathname}
          custom={entry.travel}
          variants={PAGE_VARIANTS}
          initial="enter"
          animate="center"
          exit="exit"
          className="w-full will-change-transform"
          onAnimationComplete={(definition) => {
            if (definition === 'center') setSettledPath(pathname)
          }}
        >
          <PageArrivalContext.Provider value={isArriving}>
            <FrozenRouter>{children}</FrozenRouter>
          </PageArrivalContext.Provider>
          <ArrivalScrollReset />
        </m.div>
      </AnimatePresence>
    </div>
  )
}
