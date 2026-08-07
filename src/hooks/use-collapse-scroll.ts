'use client'

import { useCallback, useEffect, useRef } from 'react'
import { EXPAND_DURATION } from '@/constants/ui'

/** Input that means the visitor has taken the scroll over, so the hook stops steering it */
const INTERRUPT_EVENTS = ['wheel', 'touchmove', 'keydown'] as const

/** Long enough to outlast the height animation and whatever frame it settles on */
const FOLLOW_MS = (EXPAND_DURATION + 0.15) * 1000

/**
 * The document carries scroll-smooth, so every plain scrollTo would be handed to the native
 * smooth scroller and race the frames this hook drives. Each step has to land immediately.
 */
const scrollToNow = (top: number) => window.scrollTo({ top, behavior: 'instant' })

/**
 * Layout height an element hands back when it collapses, margins included, so the sums
 * stay right for blocks that cancel their own padding with a negative margin.
 */
export function occupiedHeight(element: HTMLElement | null) {
  if (!element) return 0

  const { marginTop, marginBottom } = getComputedStyle(element)
  const margins = (Number.parseFloat(marginTop) || 0) + (Number.parseFloat(marginBottom) || 0)

  return element.getBoundingClientRect().height + margins
}

/**
 * Collapsing a block near the end of the document costs the scroll position in one go, and not
 * gradually as the animation might suggest: React commits a collapsed layout, the browser clamps
 * the window to the new maximum immediately, and only then does the height animation put the
 * space back underneath. The jump lands before any of the collapse is visible, which is why it
 * reads as the content vanishing rather than closing.
 *
 * So call this with the height about to disappear, right before the state flips. From inside that
 * same frame it follows the document's own maximum every frame: the clamp gets undone before it
 * is ever painted, and from there the window eases up at exactly the rate the height shrinks,
 * whatever curve that animation happens to use.
 */
export function useCollapseScroll() {
  const releaseRef = useRef<(() => void) | null>(null)

  const stop = useCallback(() => {
    releaseRef.current?.()
    releaseRef.current = null
  }, [])

  /** Returns stop as the cleanup, so unmounting mid collapse drops the loop and its listeners */
  useEffect(() => stop, [stop])

  return useCallback(
    (removedHeight: number) => {
      const scroller = document.scrollingElement
      if (!scroller || removedHeight <= 0) return

      const from = window.scrollY
      const limit = scroller.scrollHeight - removedHeight - scroller.clientHeight

      /** There is room below the fold already, so the collapse cannot move the window */
      if (from - Math.max(0, Math.min(from, limit)) < 1) return

      stop()

      const startedAt = performance.now()
      let frame = 0
      let previousMax = Number.POSITIVE_INFINITY

      const follow = () => {
        const max = Math.max(0, scroller.scrollHeight - scroller.clientHeight)

        /**
         * A growing document means the collapse was cut short or something below it loaded.
         * Chasing that would scroll the page for a reason the visitor never asked for.
         */
        if (max > previousMax + 1) return stop()
        previousMax = max

        const target = Math.min(from, max)
        if (Math.abs(window.scrollY - target) > 0.5) scrollToNow(target)

        if (performance.now() - startedAt < FOLLOW_MS) frame = requestAnimationFrame(follow)
        else stop()
      }

      frame = requestAnimationFrame(follow)

      /**
       * A keyboard toggle is still bubbling towards the window right now, so wait a frame
       * before listening or that very keydown would read as the visitor scrolling away.
       */
      const listen = requestAnimationFrame(() => {
        for (const event of INTERRUPT_EVENTS) {
          window.addEventListener(event, stop, { passive: true })
        }
      })

      releaseRef.current = () => {
        cancelAnimationFrame(frame)
        cancelAnimationFrame(listen)
        for (const event of INTERRUPT_EVENTS) window.removeEventListener(event, stop)
      }
    },
    [stop],
  )
}
