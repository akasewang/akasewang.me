'use client'

import { useCallback, useRef } from 'react'

/** Distance in px over which an edge shadow ramps between hidden and full */
const RAMP = 52

const clamp01 = (value: number) => Math.max(0, Math.min(1, value))

/** easeOutCubic, so a shadow appears promptly then settles into full */
const ease = (value: number) => 1 - (1 - value) ** 3

interface ScrollShadows<S extends HTMLElement, E extends HTMLElement> {
  scrollRef: (node: S | null) => void
  topRef: (node: E | null) => void
  bottomRef: (node: E | null) => void
}

/**
 * Drives top and bottom scroll shadows whose opacity follows how far the
 * container sits from each edge, rather than snapping on and off at the edge.
 *
 * Opacity is written straight to the shadow nodes inside a rAF-batched read, so
 * scrolling updates the shadows without re-rendering React. Observers attach the
 * moment the scroll node mounts and detach when it unmounts, which matters for a
 * list that lives inside a portal rendered only while open.
 */
export function useScrollShadows<S extends HTMLElement, E extends HTMLElement>(): ScrollShadows<
  S,
  E
> {
  const scrollEl = useRef<S | null>(null)
  const topEl = useRef<E | null>(null)
  const bottomEl = useRef<E | null>(null)
  const frame = useRef(0)
  const teardown = useRef<(() => void) | null>(null)

  const paint = useCallback(() => {
    const el = scrollEl.current
    if (!el) return

    const { scrollTop, scrollHeight, clientHeight } = el
    const max = scrollHeight - clientHeight
    const scrollable = max > 1

    const top = scrollable ? ease(clamp01(scrollTop / RAMP)) : 0
    const bottom = scrollable ? ease(clamp01((max - scrollTop) / RAMP)) : 0

    if (topEl.current) topEl.current.style.opacity = `${top}`
    if (bottomEl.current) bottomEl.current.style.opacity = `${bottom}`
  }, [])

  const scrollRef = useCallback(
    (node: S | null) => {
      teardown.current?.()
      teardown.current = null
      scrollEl.current = node
      if (!node) return

      const schedule = () => {
        cancelAnimationFrame(frame.current)
        frame.current = requestAnimationFrame(paint)
      }

      paint()

      node.addEventListener('scroll', schedule, { passive: true })
      const resizeObserver = new ResizeObserver(schedule)
      resizeObserver.observe(node)
      const mutationObserver = new MutationObserver(schedule)
      mutationObserver.observe(node, { childList: true, subtree: true })

      teardown.current = () => {
        node.removeEventListener('scroll', schedule)
        resizeObserver.disconnect()
        mutationObserver.disconnect()
        cancelAnimationFrame(frame.current)
      }
    },
    [paint],
  )

  const topRef = useCallback(
    (node: E | null) => {
      topEl.current = node
      paint()
    },
    [paint],
  )

  const bottomRef = useCallback(
    (node: E | null) => {
      bottomEl.current = node
      paint()
    },
    [paint],
  )

  return { scrollRef, topRef, bottomRef }
}
