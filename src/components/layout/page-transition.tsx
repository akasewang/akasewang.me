'use client'

import { AnimatePresence, m, type Variants } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { type ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  PAGE_ARRIVAL_TIMEOUT_MS,
  PAGE_ENTER_TRANSITION,
  PAGE_EXIT_TRANSITION,
  PAGE_SLIDE_X,
  PAGE_SLIDE_Y,
} from '@/constants/ui'
import { PageArrivalContext } from '@/hooks/use-page-arrival'
import { type PageTravel, resolvePageTravel } from '@/utils/page-transition'
import { getSiblingDirection } from '@/utils/route-direction'
import { flushScrollReset, markRouteChange, takeOverScrollRestoration } from '@/utils/route-scroll'
import { FrozenRouter } from './frozen-router'

/** A layout effect on the client, a plain one on the server, where layout effects do not run */
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

/**
 * Where a page waits, rests and leaves for, read from the travel worked out above.
 *
 * The first load is already in place beneath the fading loader. Otherwise a page enters from the
 * side it is travelling from and leaves towards the opposite one, so the outgoing and incoming
 * pages move together as one.
 */
const PAGE_VARIANTS: Variants = {
  enter: ({ axis, sign, opening }: PageTravel) =>
    opening
      ? { opacity: 1, x: 0, y: 0 }
      : {
          opacity: 1,
          x: axis === 'x' ? `${sign * PAGE_SLIDE_X}vw` : 0,
          y: axis === 'y' ? `${sign * PAGE_SLIDE_Y}vh` : 0,
        },
  center: ({ opening }: PageTravel) => ({
    opacity: 1,
    x: 0,
    y: 0,
    transition: opening ? { duration: 0 } : PAGE_ENTER_TRANSITION,
  }),
  exit: ({ axis, sign }: PageTravel) => ({
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
function ArrivalScrollReset({ path, onMount }: { path: string; onMount: (path: string) => void }) {
  useIsomorphicLayoutEffect(() => {
    onMount(path)
    return flushScrollReset()
  }, [onMount, path])

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
  const requestedPathRef = useRef(pathname)
  const visiblePathRef = useRef(pathname)
  const [entry, setEntry] = useState(() => ({
    path: pathname,
    travel: resolvePageTravel(null, pathname),
  }))
  const [isArriving, setIsArriving] = useState(true)
  const [settledPath, setSettledPath] = useState<string | null>(null)
  const handleArrivalMount = useCallback((mountedPath: string) => {
    visiblePathRef.current = mountedPath
  }, [])

  if (entry.path !== pathname) {
    setEntry({
      path: pathname,
      travel: resolvePageTravel(entry.path, pathname, getSiblingDirection(entry.path, pathname)),
    })
    setIsArriving(true)
    setSettledPath(null)
  }

  useEffect(takeOverScrollRestoration, [])

  useIsomorphicLayoutEffect(() => {
    if (requestedPathRef.current === entry.path) return

    markRouteChange(visiblePathRef.current, entry.path)
    requestedPathRef.current = entry.path
  }, [entry.path])

  useEffect(() => {
    if (settledPath === null || settledPath !== entry.path) return

    const frame = requestAnimationFrame(() => setIsArriving(false))

    return () => cancelAnimationFrame(frame)
  }, [settledPath, entry.path])

  useEffect(() => {
    if (!isArriving) return

    const arrivingPath = entry.path
    const timer = setTimeout(() => {
      if (requestedPathRef.current === arrivingPath) setIsArriving(false)
    }, PAGE_ARRIVAL_TIMEOUT_MS)

    return () => clearTimeout(timer)
  }, [isArriving, entry.path])

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
          key={entry.path}
          custom={entry.travel}
          variants={PAGE_VARIANTS}
          initial="enter"
          animate="center"
          exit="exit"
          className="w-full"
          style={{ willChange: isArriving ? 'transform, opacity' : undefined }}
          onAnimationComplete={(definition) => {
            if (definition === 'center') setSettledPath(entry.path)
          }}
        >
          <PageArrivalContext.Provider value={isArriving}>
            <FrozenRouter>{children}</FrozenRouter>
          </PageArrivalContext.Provider>
          <ArrivalScrollReset path={entry.path} onMount={handleArrivalMount} />
        </m.div>
      </AnimatePresence>
    </div>
  )
}
