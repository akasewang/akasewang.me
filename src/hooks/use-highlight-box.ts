'use client'

import { useCallback, useRef } from 'react'
import { animate, useMotionValue, useTransform } from 'framer-motion'
import {
  HIGHLIGHT_APPEAR_SPRING,
  HIGHLIGHT_FADE_IN,
  HIGHLIGHT_FADE_OUT,
  HIGHLIGHT_LEAD_SPRING,
  HIGHLIGHT_TRAIL_SPRING,
} from '@/constants/ui'

/** Target box edges, in pixels relative to the highlight's positioned parent. */
export interface HighlightBox {
  left: number
  top: number
  right: number
  bottom: number
}

/** Lazily created media query so reduced motion tracks live OS changes mid session. */
let reduceMotionQuery: MediaQueryList | null = null
const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false
  reduceMotionQuery ??= window.matchMedia('(prefers-reduced-motion: reduce)')
  return reduceMotionQuery.matches
}

/**
 * Shared motion engine for the floating highlight components ({@link HoverHighlight}
 * and {@link MenuHighlight}). Owns the box edge motion values and the glide behavior,
 * leaving each consumer to supply only its item tracking strategy.
 *
 * On the first `moveTo` the highlight materializes on the item's full box (fading in
 * while relaxing from a slight shrink, so it breathes into place rather than popping).
 * Subsequent moves animate the four box edges independently: the leading edge springs
 * ahead and the trailing edge follows, stretching the highlight toward the direction
 * of travel. `hide` dissolves it with a gentle exhale. All motion runs through Framer
 * Motion values and the imperative `animate()` API, so following items never triggers
 * a React rerender. A `prefers-reduced-motion` preference snaps instead of gliding.
 *
 * @returns `style` to spread on the highlight `m.div`, plus `moveTo`/`hide` controls.
 */
export function useHighlightBox() {
  const left = useMotionValue(0)
  const top = useMotionValue(0)
  const right = useMotionValue(0)
  const bottom = useMotionValue(0)
  const opacity = useMotionValue(0)
  const scale = useMotionValue(1)

  /** Box size derived from the animated edges so width/height never need springs of their own. */
  const width = useTransform(() => right.get() - left.get())
  const height = useTransform(() => bottom.get() - top.get())

  /**
   * While hidden, the box is snapped onto the next target while opacity and scale ease
   * in, so it appears at full size (no growing into shape). Once visible, it glides.
   */
  const visibleRef = useRef(false)

  const moveTo = useCallback(
    (box: HighlightBox) => {
      if (visibleRef.current && !prefersReducedMotion()) {
        /**
         * Pick the leading edge per axis from the direction of travel: moving down means
         * the bottom edge arrives first, moving up the top edge, likewise horizontally.
         */
        const movingDown = box.top >= top.get()
        const movingRight = box.left >= left.get()

        animate(top, box.top, movingDown ? HIGHLIGHT_TRAIL_SPRING : HIGHLIGHT_LEAD_SPRING)
        animate(bottom, box.bottom, movingDown ? HIGHLIGHT_LEAD_SPRING : HIGHLIGHT_TRAIL_SPRING)
        animate(left, box.left, movingRight ? HIGHLIGHT_TRAIL_SPRING : HIGHLIGHT_LEAD_SPRING)
        animate(right, box.right, movingRight ? HIGHLIGHT_LEAD_SPRING : HIGHLIGHT_TRAIL_SPRING)
      } else {
        /**
         * `jump` (not `set`) so an in flight spring is cancelled rather than resuming next
         * frame; used for the first appearance and for every move under reduced motion.
         */
        left.jump(box.left)
        top.jump(box.top)
        right.jump(box.right)
        bottom.jump(box.bottom)
      }

      if (!visibleRef.current) {
        visibleRef.current = true
        if (prefersReducedMotion()) {
          opacity.jump(1)
          scale.jump(1)
        } else {
          scale.jump(0.97)
          animate(scale, 1, HIGHLIGHT_APPEAR_SPRING)
          animate(opacity, 1, HIGHLIGHT_FADE_IN)
        }
      }
    },
    [left, top, right, bottom, opacity, scale],
  )

  const hide = useCallback(() => {
    visibleRef.current = false
    if (prefersReducedMotion()) {
      opacity.jump(0)
    } else {
      /** Dissolve with a gentle exhale so the wash recedes rather than switching off. */
      animate(opacity, 0, HIGHLIGHT_FADE_OUT)
      animate(scale, 0.985, HIGHLIGHT_FADE_OUT)
    }
  }, [opacity, scale])

  return {
    style: { x: left, y: top, width, height, opacity, scale },
    moveTo,
    hide,
  }
}
