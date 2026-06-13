'use client'

import { useEffect } from 'react'
import { m } from 'framer-motion'
import { useHighlightBox } from '@/hooks/use-highlight-box'

/**
 * A floating highlight that tracks the `data-highlight-item` element the pointer is over
 * within `parentRef`, the hover driven counterpart to {@link MenuHighlight}, which instead
 * follows Radix's `data-highlighted` attribute. The glide, materialize and dissolve motion
 * lives in the shared {@link useHighlightBox} hook; this component only supplies the
 * pointer based item tracking.
 *
 * Inert by design: a container with no `data-highlight-item` children never shows a
 * highlight, so it can be dropped into any list safely.
 *
 * Consumer contract:
 * - `parentRef` must be positioned (e.g. `relative`), so the highlight can be offset against it.
 * - Mark each hoverable element with `data-highlight-item`.
 * - The highlight paints at `z-0`; give items a higher layer (e.g. `relative z-10`) so their
 *   content sits above it.
 *
 * @param parentRef - The container the highlight is rendered into and scoped to.
 */
export function HoverHighlight({ parentRef }: { parentRef: React.RefObject<HTMLElement | null> }) {
  const { style, moveTo, hide } = useHighlightBox()

  useEffect(() => {
    const parent = parentRef.current
    if (!parent) return

    /**
     * The card the highlight currently tracks. `pointerover` fires on every crossing
     * between a card's nested children, so we skip the layout reads + animations unless
     * the cursor has actually moved to a different card.
     */
    let active: HTMLElement | null = null

    const handlePointerOver = (e: PointerEvent) => {
      const item = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-highlight-item]')
      /**
       * Ignore movement over the gaps between items (closest === null) and repeat
       * events fired while still hovering the same card.
       */
      if (!item || item === active || !parent.contains(item)) return
      active = item

      const parentRect = parent.getBoundingClientRect()
      const rect = item.getBoundingClientRect()
      const left = rect.left - parentRect.left
      const top = rect.top - parentRect.top

      moveTo({ left, top, right: left + rect.width, bottom: top + rect.height })
    }

    const handlePointerLeave = () => {
      active = null
      hide()
    }

    parent.addEventListener('pointerover', handlePointerOver)
    parent.addEventListener('pointerleave', handlePointerLeave)

    return () => {
      parent.removeEventListener('pointerover', handlePointerOver)
      parent.removeEventListener('pointerleave', handlePointerLeave)
    }
  }, [parentRef, moveTo, hide])

  return (
    <m.div
      style={style}
      className="pointer-events-none absolute left-0 top-0 z-0 rounded-xl bg-gradient-to-b from-accent to-accent/50 shadow-md ring-1 ring-accent-border retina:ring-[0.5px]"
    />
  )
}
