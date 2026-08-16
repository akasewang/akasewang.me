'use client'

import { m } from 'framer-motion'
import { useEffect } from 'react'
import { type HighlightBox, useHighlightBox } from '@/hooks/use-highlight-box'
import { cn } from '@/utils/utils'

/** The item under the pointer or the keyboard cursor, which is what the box follows */
const HIGHLIGHTED_ITEM_SELECTOR = '[data-menu-highlight-item][data-highlighted]'

/** The item already chosen, which the box falls back to once the pointer leaves */
const CHECKED_ITEM_SELECTOR = '[data-menu-highlight-item][data-selected]'

/**
 * An item can measure as nothing while its menu is still opening. Measuring is retried for a few
 * frames before giving up, so the box does not settle on a size the item never really had.
 */
const MAX_ZERO_BOX_RETRIES = 10

/** The list this is dropped into has to be the box's offset parent, which relative makes it */
export const MENU_HIGHLIGHT_VIEWPORT_CLASS = 'relative flex flex-col gap-0.5 p-1.5'

const sameBox = (a: HighlightBox | null, b: HighlightBox) =>
  Boolean(a && a.left === b.left && a.top === b.top && a.right === b.right && a.bottom === b.bottom)

/**
 * Offsets rather than a bounding rect, so the numbers are already relative to the list and stay
 * right while the menu itself is mid animation.
 */
const boxOf = (el: HTMLElement): HighlightBox => {
  const left = el.offsetLeft
  const top = el.offsetTop
  return { left, top, right: left + el.offsetWidth, bottom: top + el.offsetHeight }
}

/**
 * The single box that slides between items in a menu, instead of each item lighting up its own
 * background.
 *
 * Items say which one is current through data attributes, so nothing has to be wired up per item:
 * a mutation observer watches those attributes and remeasures whenever one changes. Measuring is
 * held to one frame so a burst of changes costs a single pass, and repeated after the menu has had
 * a moment to settle, since an item inside a menu that is still opening can measure as nothing.
 *
 * With returnToChecked the box goes back to the chosen item when the pointer leaves, which suits a
 * menu that holds a selection. Without it the box simply hides.
 */
export function MenuHighlight({
  parentRef,
  returnToChecked = false,
  className,
}: {
  parentRef: React.RefObject<HTMLElement | null>
  returnToChecked?: boolean
  className?: string
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
      /** What the pointer is on wins, and the checked item is what it falls back to */
      const active =
        root.querySelector<HTMLElement>(HIGHLIGHTED_ITEM_SELECTOR) ??
        root.querySelector<HTMLElement>(CHECKED_ITEM_SELECTOR)

      if (!active) {
        if (activeItem) resizeObserver.unobserve(activeItem)
        activeItem = null
        activeBox = null
        zeroBoxRetries = 0
        hide()
        return
      }

      const nextBox = boxOf(active)

      /**
       * A box with no area means the item is measured before it has been laid out, which happens
       * on the frame a menu opens. Worth a few more frames rather than hiding on the first look.
       */
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
      /** Nothing has actually moved, so the box is left where it is rather than re-animated */
      if (active === activeItem && sameBox(activeBox, nextBox)) return

      /** Only the item being tracked is watched for resizing, and it changes as the box moves */
      if (activeItem && active !== activeItem) resizeObserver.unobserve(activeItem)
      if (active !== activeItem) resizeObserver.observe(active)
      activeItem = active
      activeBox = nextBox
      moveTo(nextBox)
    }

    /** The library moves these attributes about, and they are the only signal that it has */
    const observer = new MutationObserver(schedule)
    observer.observe(root, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['data-highlighted', 'data-selected'],
    })

    const resizeObserver = new ResizeObserver(schedule)
    resizeObserver.observe(root)

    measure()

    const handlePointerLeave = () => {
      zeroBoxRetries = 0

      const checked = returnToChecked
        ? root.querySelector<HTMLElement>(CHECKED_ITEM_SELECTOR)
        : null

      if (checked) {
        const nextBox = boxOf(checked)
        if (activeItem && checked !== activeItem) resizeObserver.unobserve(activeItem)
        if (checked !== activeItem) resizeObserver.observe(checked)
        activeItem = checked
        activeBox = nextBox
        moveTo(nextBox)
        return
      }

      const highlighted = root.querySelector<HTMLElement>(HIGHLIGHTED_ITEM_SELECTOR)
      if (highlighted) {
        return
      }

      if (activeItem) resizeObserver.unobserve(activeItem)
      activeItem = null
      activeBox = null
      hide()
    }

    root.addEventListener('pointerleave', handlePointerLeave)

    const t1 = setTimeout(measure, 50)
    const t2 = setTimeout(measure, 150)

    return () => {
      observer.disconnect()
      resizeObserver.disconnect()
      root.removeEventListener('pointerleave', handlePointerLeave)
      cancelAnimationFrame(frame)
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [parentRef, moveTo, hide, returnToChecked])

  return (
    <m.div
      style={style}
      className={cn(
        'pointer-events-none absolute left-0 top-0 z-0 rounded-lg bg-overlay-accent ring-1 ring-overlay-accent-border retina:ring-[0.5px]',
        className,
      )}
    />
  )
}
