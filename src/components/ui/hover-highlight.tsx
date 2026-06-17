'use client'

import { m } from 'framer-motion'
import { useEffect } from 'react'
import { useHighlightBox } from '@/hooks/use-highlight-box'
import { canUseHoverPointer } from '@/utils/pointer'

export function HoverHighlight({ parentRef }: { parentRef: React.RefObject<HTMLElement | null> }) {
  const { style, moveTo, hide } = useHighlightBox()

  useEffect(() => {
    const parent = parentRef.current
    if (!parent) return

    let active: HTMLElement | null = null

    const handlePointerOver = (e: PointerEvent) => {
      if (!canUseHoverPointer(e.pointerType)) return

      const item = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-highlight-item]')

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
