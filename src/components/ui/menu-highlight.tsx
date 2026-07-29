'use client'

import { m } from 'framer-motion'
import { useEffect } from 'react'
import { type HighlightBox, useHighlightBox } from '@/hooks/use-highlight-box'

const HIGHLIGHTED_ITEM_SELECTOR = '[data-menu-highlight-item][data-highlighted]'
const CHECKED_ITEM_SELECTOR = '[data-menu-highlight-item][data-selected]'
const MAX_ZERO_BOX_RETRIES = 10

export const MENU_HIGHLIGHT_VIEWPORT_CLASS = 'relative flex flex-col gap-0.5 p-1.5'

const sameBox = (a: HighlightBox | null, b: HighlightBox) =>
  Boolean(a && a.left === b.left && a.top === b.top && a.right === b.right && a.bottom === b.bottom)

const boxOf = (el: HTMLElement): HighlightBox => {
  const left = el.offsetLeft
  const top = el.offsetTop
  return { left, top, right: left + el.offsetWidth, bottom: top + el.offsetHeight }
}

export function MenuHighlight({
  parentRef,
  returnToChecked = false,
}: {
  parentRef: React.RefObject<HTMLElement | null>
  returnToChecked?: boolean
}) {
  const { style, moveTo, hide } = useHighlightBox()

  useEffect(() => {
    const parent = parentRef.current
    if (!parent) return
    const root = parent

    let frame = 0
    let zeroBoxRetries = 0
    let activeItem: HTMLElement | null = null
    let activeBox: HighlightBox | null = null

    function schedule() {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(measure)
    }

    function measure() {
      const active =
        root.querySelector<HTMLElement>(HIGHLIGHTED_ITEM_SELECTOR) ??
        root.querySelector<HTMLElement>(CHECKED_ITEM_SELECTOR)

      if (!active) {
        zeroBoxRetries = 0
        return
      }

      const nextBox = boxOf(active)

      if (nextBox.right <= nextBox.left || nextBox.bottom <= nextBox.top) {
        if (zeroBoxRetries < MAX_ZERO_BOX_RETRIES) {
          zeroBoxRetries += 1
          schedule()
        } else {
          hide()
        }
        return
      }

      zeroBoxRetries = 0
      if (active === activeItem && sameBox(activeBox, nextBox)) return

      activeItem = active
      activeBox = nextBox
      moveTo(nextBox)
    }

    const observer = new MutationObserver(schedule)
    observer.observe(root, {
      subtree: true,
      attributes: true,
      attributeFilter: ['data-highlighted', 'data-selected'],
    })

    measure()

    const handlePointerLeave = () => {
      zeroBoxRetries = 0

      const checked = returnToChecked
        ? root.querySelector<HTMLElement>(CHECKED_ITEM_SELECTOR)
        : null

      if (!checked) {
        activeItem = null
        activeBox = null
        hide()
        return
      }

      const nextBox = boxOf(checked)
      activeItem = checked
      activeBox = nextBox
      moveTo(nextBox)
    }

    root.addEventListener('pointerleave', handlePointerLeave)

    const t1 = setTimeout(measure, 50)
    const t2 = setTimeout(measure, 150)

    return () => {
      observer.disconnect()
      root.removeEventListener('pointerleave', handlePointerLeave)
      cancelAnimationFrame(frame)
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [parentRef, moveTo, hide, returnToChecked])

  return (
    <m.div
      style={style}
      className="pointer-events-none absolute left-0 top-0 z-0 rounded-lg bg-gradient-to-b from-overlay-accent to-overlay-accent/50 ring-1 ring-overlay-accent-border retina:ring-[0.5px]"
    />
  )
}
