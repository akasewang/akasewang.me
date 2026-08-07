'use client'

import { animate, useMotionValue } from 'framer-motion'
import { useCallback, useRef } from 'react'
import {
  HIGHLIGHT_APPEAR_SPRING,
  HIGHLIGHT_FADE_IN,
  HIGHLIGHT_FADE_OUT,
  HIGHLIGHT_LEAD_SPRING,
  HIGHLIGHT_TRAIL_SPRING,
} from '@/constants/ui'
import { prefersReducedMotion } from '@/utils/motion'

export interface HighlightBox {
  left: number
  top: number
  right: number
  bottom: number
}

/**
 * Drives the single box that slides between hovered rows. Position and size are motion values, so
 * the box animates entirely outside React and hovering a list never re-renders it.
 */
export function useHighlightBox() {
  const left = useMotionValue(0)
  const top = useMotionValue(0)
  const width = useMotionValue(0)
  const height = useMotionValue(0)
  const opacity = useMotionValue(0)
  const scale = useMotionValue(1)

  const visibleRef = useRef(false)

  const moveTo = useCallback(
    (box: HighlightBox) => {
      const nextWidth = Math.max(0, box.right - box.left)
      const nextHeight = Math.max(0, box.bottom - box.top)

      /**
       * Position leads and size trails, which is what gives the box its stretch as it travels. It only
       * animates when already visible: appearing has to be a jump to the new row, or the box would be
       * seen sweeping in from wherever it last sat.
       */
      if (visibleRef.current && !prefersReducedMotion()) {
        animate(left, box.left, HIGHLIGHT_LEAD_SPRING)
        animate(top, box.top, HIGHLIGHT_LEAD_SPRING)
        animate(width, nextWidth, HIGHLIGHT_TRAIL_SPRING)
        animate(height, nextHeight, HIGHLIGHT_TRAIL_SPRING)
      } else {
        left.jump(box.left)
        top.jump(box.top)
        width.jump(nextWidth)
        height.jump(nextHeight)
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
    [left, top, width, height, opacity, scale],
  )

  const hide = useCallback(() => {
    visibleRef.current = false
    if (prefersReducedMotion()) {
      opacity.jump(0)
    } else {
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
