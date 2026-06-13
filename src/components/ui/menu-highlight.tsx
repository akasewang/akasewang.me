'use client'

import { useEffect } from 'react'
import { m } from 'framer-motion'
import { useHighlightBox } from '@/hooks/use-highlight-box'

/**
 * A floating highlight that tracks the currently `data-highlighted` (or `data-state=checked`)
 * item within `parentRef`, the menu driven counterpart to {@link HoverHighlight}, following
 * Radix's highlight state instead of raw pointer events so keyboard navigation is covered too.
 * The glide, materialize and dissolve motion lives in the shared {@link useHighlightBox}
 * hook; this component only supplies the Radix attribute based item tracking.
 *
 * @param parentRef - The menu content container the highlight is rendered into and scoped to.
 */
export function MenuHighlight({ parentRef }: { parentRef: React.RefObject<HTMLElement | null> }) {
  const { style, moveTo, hide } = useHighlightBox()

  useEffect(() => {
    const parent = parentRef.current
    if (!parent) return

    let frame = 0

    const measure = () => {
      const active =
        parent.querySelector<HTMLElement>('[data-highlighted]') ??
        parent.querySelector<HTMLElement>('[data-state=checked]')

      if (!active) {
        hide()
        return
      }

      /** Offsets are layout values, so the menu's open/close transform never skews them. */
      const left = active.offsetLeft
      const top = active.offsetTop

      moveTo({ left, top, right: left + active.offsetWidth, bottom: top + active.offsetHeight })
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

    /** Re-measure after the menu's entrance animation settles late layout. */
    const t1 = setTimeout(measure, 50)
    const t2 = setTimeout(measure, 150)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [parentRef, moveTo, hide])

  return (
    <m.div
      style={style}
      className="pointer-events-none absolute left-0 top-0 z-0 rounded-lg bg-gradient-to-b from-overlay-accent to-overlay-accent/50 ring-1 ring-overlay-accent-border retina:ring-[0.5px]"
    />
  )
}
