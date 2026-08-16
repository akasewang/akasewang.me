'use client'

import { type PointerEvent, useCallback, useEffect, useRef } from 'react'
import { prefersReducedMotion } from '@/utils/motion'
import { getParallaxOffset, PROJECT_MEDIA_ZOOM } from '@/utils/parallax'
import { canUseHoverPointer } from '@/utils/pointer'

/**
 * Leans the medium toward the cursor while it crosses a card.
 *
 * The offsets are written to the element as custom properties rather than kept in state, because
 * this runs on every pointer move and rendering React on each one would cost far more than the
 * effect is worth. The medium reads them from CSS, so nothing above it re-renders at all.
 *
 * Coalesced into an animation frame so a burst of moves between paints collapses into the single
 * write the paint will actually use, and only for a real mouse: a touch reports a position once on
 * tap, which would jump the medium and leave it there.
 */
export function useCursorParallax<T extends HTMLElement>(zoom = PROJECT_MEDIA_ZOOM) {
  const ref = useRef<T>(null)
  const frame = useRef<number | null>(null)
  const pointer = useRef({ x: 0, y: 0 })

  const write = useCallback((x: number, y: number) => {
    const element = ref.current
    if (!element) return

    element.style.setProperty('--parallax-x', `${x.toFixed(2)}px`)
    element.style.setProperty('--parallax-y', `${y.toFixed(2)}px`)
  }, [])

  const cancel = useCallback(() => {
    if (frame.current === null) return

    cancelAnimationFrame(frame.current)
    frame.current = null
  }, [])

  const onPointerMove = useCallback(
    (event: PointerEvent<T>) => {
      if (!canUseHoverPointer(event.pointerType) || prefersReducedMotion()) {
        cancel()
        write(0, 0)
        return
      }

      pointer.current = { x: event.clientX, y: event.clientY }
      if (frame.current !== null) return

      frame.current = requestAnimationFrame(() => {
        frame.current = null

        const element = ref.current
        if (!element) return

        const bounds = element.getBoundingClientRect()
        const offset = getParallaxOffset(pointer.current, bounds, zoom)
        write(offset.x, offset.y)
      })
    },
    [cancel, write, zoom],
  )

  /** Settles back to centre on the way out, on the same easing the zoom releases with */
  const onPointerLeave = useCallback(() => {
    cancel()
    write(0, 0)
  }, [cancel, write])

  useEffect(
    () => () => {
      cancel()
      const element = ref.current
      element?.style.removeProperty('--parallax-x')
      element?.style.removeProperty('--parallax-y')
    },
    [cancel],
  )

  return { ref, onPointerMove, onPointerLeave }
}
