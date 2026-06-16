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

export interface HighlightBox {
  left: number
  top: number
  right: number
  bottom: number
}

let reduceMotionQuery: MediaQueryList | null = null
const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false
  reduceMotionQuery ??= window.matchMedia('(prefers-reduced-motion: reduce)')
  return reduceMotionQuery.matches
}

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
