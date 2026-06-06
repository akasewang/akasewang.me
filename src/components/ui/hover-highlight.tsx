'use client'

import { useEffect } from 'react'
import { m, useMotionValue, animate, type Transition } from 'framer-motion'
import { SMOOTH_SPRING_TRANSITION } from '@/constants/ui'

/** Short opacity only fade so the highlight eases in softly without its box animating. */
const FADE_IN: Transition = { type: 'tween', duration: 0.18, ease: 'easeOut' }

/**
 * A floating highlight that tracks the `data-highlight-item` element the pointer is over
 * within `parentRef` — the hover driven counterpart to {@link MenuHighlight}, which instead
 * follows Radix's `data-highlighted` attribute.
 *
 * On the first hover it appears instantly at the item's full box (fading only its opacity
 * in, so it never visibly grows or shrinks into shape), then glides between items as the
 * cursor moves. All motion runs through Framer Motion values and the imperative `animate()`
 * API, so following the cursor never triggers a React rerender. A `prefers-reduced-motion`
 * preference disables the glide and fade, snapping instead.
 *
 * Inert by design: a container with no `data-highlight-item` children never shows a
 * highlight, so it can be dropped into any list safely.
 *
 * Consumer contract:
 * - `parentRef` must be positioned (e.g. `relative`) — the highlight is offset against it.
 * - Mark each hoverable element with `data-highlight-item`.
 * - The highlight paints at `z-0`; give items a higher layer (e.g. `relative z-10`) so their
 *   content sits above it.
 *
 * @param parentRef - The container the highlight is rendered into and scoped to.
 */
export function HoverHighlight({ parentRef }: { parentRef: React.RefObject<HTMLElement | null> }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const width = useMotionValue(0)
  const height = useMotionValue(0)
  const opacity = useMotionValue(0)

  useEffect(() => {
    const parent = parentRef.current
    if (!parent) return

    /**
     * While hidden, the highlight's box is snapped onto the first hovered item while
     * opacity fades in — so it appears at full size (no shrink) but eases in softly
     * instead of popping. Once visible, it glides between items as the cursor moves.
     */
    let visible = false
    /**
     * The card the highlight currently tracks. `pointerover` fires on every crossing
     * between a card's nested children, so we skip the layout reads + animations unless
     * the cursor has actually moved to a different card.
     */
    let active: HTMLElement | null = null
    /**
     * Honour the user's reduced motion preference (live, so it tracks OS changes mid-
     * session): snap everything instead of gliding/fading, matching globals.css.
     */
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    const moveTo = (el: HTMLElement) => {
      const parentRect = parent.getBoundingClientRect()
      const rect = el.getBoundingClientRect()
      const left = rect.left - parentRect.left
      const top = rect.top - parentRect.top

      /**
       * `jump` (not `set`) so an in flight spring is cancelled rather than resuming next
       * frame; used for the first appearance and for every move under reduced motion.
       */
      if (visible && !reduceMotion.matches) {
        animate(x, left, SMOOTH_SPRING_TRANSITION)
        animate(y, top, SMOOTH_SPRING_TRANSITION)
        animate(width, rect.width, SMOOTH_SPRING_TRANSITION)
        animate(height, rect.height, SMOOTH_SPRING_TRANSITION)
      } else {
        x.jump(left)
        y.jump(top)
        width.jump(rect.width)
        height.jump(rect.height)
      }

      if (!visible) {
        visible = true
        if (reduceMotion.matches) opacity.jump(1)
        else animate(opacity, 1, FADE_IN)
      }
    }

    const handlePointerOver = (e: PointerEvent) => {
      const item = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-highlight-item]')
      /**
       * Ignore movement over the gaps between items (closest === null) and repeat
       * events fired while still hovering the same card.
       */
      if (!item || item === active || !parent.contains(item)) return
      active = item
      moveTo(item)
    }

    const handlePointerLeave = () => {
      visible = false
      active = null
      if (reduceMotion.matches) opacity.jump(0)
      else animate(opacity, 0, SMOOTH_SPRING_TRANSITION)
    }

    parent.addEventListener('pointerover', handlePointerOver)
    parent.addEventListener('pointerleave', handlePointerLeave)

    return () => {
      parent.removeEventListener('pointerover', handlePointerOver)
      parent.removeEventListener('pointerleave', handlePointerLeave)
    }
  }, [parentRef, x, y, width, height, opacity])

  return (
    <m.div
      style={{ x, y, width, height, opacity }}
      className="pointer-events-none absolute left-0 top-0 z-0 rounded-xl bg-accent shadow-md ring-1 ring-accent-border retina:ring-[0.5px]"
    />
  )
}
