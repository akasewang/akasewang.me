'use client'

import { useEffect } from 'react'
import { m, useMotionValue, animate } from 'framer-motion'
import { SMOOTH_SPRING_TRANSITION } from '@/constants/ui'

/**
 * A floating highlight that tracks the currently `data-highlighted` item within
 * `parentRef`. Driven by Framer Motion values and the imperative `animate()` API
 * so following the cursor/keyboard across items never triggers a React rerender.
 */
export function MenuHighlight({ parentRef }: { parentRef: React.RefObject<HTMLElement | null> }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const width = useMotionValue(0)
  const height = useMotionValue(0)
  const opacity = useMotionValue(0)

  useEffect(() => {
    const parent = parentRef.current
    if (!parent) return

    let frame = 0

    const measure = () => {
      const active =
        parent.querySelector<HTMLElement>('[data-highlighted]') ??
        parent.querySelector<HTMLElement>('[data-state=checked]')
      if (!active) {
        animate(opacity, 0, SMOOTH_SPRING_TRANSITION)
        return
      }
      animate(x, active.offsetLeft, SMOOTH_SPRING_TRANSITION)
      animate(y, active.offsetTop, SMOOTH_SPRING_TRANSITION)
      animate(width, active.offsetWidth, SMOOTH_SPRING_TRANSITION)
      animate(height, active.offsetHeight, SMOOTH_SPRING_TRANSITION)
      animate(opacity, 1, SMOOTH_SPRING_TRANSITION)
    }

    const schedule = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(measure)
    }

    const observer = new MutationObserver(schedule)
    observer.observe(parent, {
      subtree: true,
      attributes: true,
      attributeFilter: ['data-highlighted', 'data-state'],
    })

    measure()

    const t1 = setTimeout(measure, 50)
    const t2 = setTimeout(measure, 150)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [parentRef, x, y, width, height, opacity])

  return (
    <m.div
      style={{ x, y, width, height, opacity }}
      className="absolute left-0 top-0 z-0 rounded-lg bg-overlay-accent ring-1 ring-overlay-accent-border pointer-events-none"
    />
  )
}
