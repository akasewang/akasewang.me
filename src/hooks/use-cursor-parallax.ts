'use client'

import { type PointerEvent, useCallback, useEffect, useRef } from 'react'
import { prefersReducedMotion } from '@/utils/motion'
import { canUseHoverPointer } from '@/utils/pointer'

/**
 * How far the medium drifts at the very edge of the card, as a fraction of the card itself.
 *
 * A fraction rather than a pixel count because the room to move is a fraction too. Scaling a medium
 * that already fills its frame is what creates the slack the drift moves into, and a zoom of 1.03
 * leaves half of that three percent, so 0.015, spare on each side. Drifting further than the zoom
 * has grown slides the medium off its own frame and shows the surface behind it, and since the
 * slack scales with the card while a fixed offset does not, pixels would hold on a wide card and
 * fail on a short one. Staying at four fifths of the slack holds at every size.
 */
const DRIFT_RATIO = 0.012

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
export function useCursorParallax<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const frame = useRef<number | null>(null)

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
      if (!canUseHoverPointer(event.pointerType) || prefersReducedMotion()) return

      const element = ref.current
      if (!element) return

      const { left, top, width, height } = element.getBoundingClientRect()
      /** -0.5 at one edge through 0 at the centre to 0.5 at the other */
      const fromCentreX = (event.clientX - left) / width - 0.5
      const fromCentreY = (event.clientY - top) / height - 0.5

      cancel()
      frame.current = requestAnimationFrame(() => {
        frame.current = null
        write(fromCentreX * width * DRIFT_RATIO * 2, fromCentreY * height * DRIFT_RATIO * 2)
      })
    },
    [cancel, write],
  )

  /** Settles back to centre on the way out, on the same easing the zoom releases with */
  const onPointerLeave = useCallback(() => {
    cancel()
    write(0, 0)
  }, [cancel, write])

  useEffect(() => cancel, [cancel])

  return { ref, onPointerMove, onPointerLeave }
}
