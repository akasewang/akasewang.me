'use client'

import { m } from 'framer-motion'
import { useEffect } from 'react'
import { useHighlightBox } from '@/hooks/use-highlight-box'
import { canUseHoverPointer } from '@/utils/pointer'

interface HoverHighlightProps {
  parentRef: React.RefObject<HTMLElement | null>
}

/**
 * A single box that follows the pointer between the items of a list, rather than each item lighting
 * its own background.
 *
 * One listener sits on the list and finds the item under the pointer by walking up from the event's
 * target, so items need only carry the marker attribute and nothing has to be wired up per item or
 * rebound as the list changes. Touch is ignored, there being no hover to follow, and a tap would
 * otherwise strand the box wherever it was last left.
 *
 * The sibling of this in menus is MenuHighlight, which follows the keyboard rather than the pointer.
 */
export function HoverHighlight({ parentRef }: HoverHighlightProps) {
  const { style, moveTo, hide } = useHighlightBox()

  useEffect(() => {
    const parent = parentRef.current
    if (!parent) return

    let active: HTMLElement | null = null

    const handlePointerOver = (e: PointerEvent) => {
      if (!canUseHoverPointer(e.pointerType)) return

      const item = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-highlight-item]')

      /* The remembered item may have been filtered out of the list, which makes it stale */
      if (active && !active.isConnected) active = null

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
      className="pointer-events-none absolute left-0 top-0 z-0 rounded-xl bg-accent shadow-sm ring-1 ring-accent-border retina:ring-[0.5px]"
    />
  )
}
