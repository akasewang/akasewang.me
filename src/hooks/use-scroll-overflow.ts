'use client'

import { useCallback, useRef } from 'react'

/** How deep a fade grows to, and how much scrolling it takes to grow to it */
const MASK_HEIGHT = 56
const RAMP = 52

const clamp01 = (value: number) => Math.max(0, Math.min(1, value))
const easeOutCubic = (value: number) => 1 - (1 - value) ** 3

/**
 * Marks a scroll viewport only while its content genuinely overflows, so edge masks never fade
 * content that already fits. Trailing padding is excluded from the remaining-content calculation:
 * scrolling that reveals only breathing room must not produce a bottom fade.
 */
export function useScrollOverflow<S extends HTMLElement>({
  axis = 'y',
  contentSelector,
}: {
  axis?: 'x' | 'y'
  contentSelector?: string
} = {}) {
  const teardown = useRef<(() => void) | null>(null)
  const refresh = useRef<() => void>(() => undefined)

  const scrollRef = useCallback(
    (node: S | null) => {
      teardown.current?.()
      teardown.current = null
      if (!node) return

      let frame = 0

      const paint = () => {
        const isY = axis === 'y'
        const scrollRange = isY
          ? node.scrollHeight - node.clientHeight
          : node.scrollWidth - node.clientWidth
        const styles = getComputedStyle(node)
        const trailingPadding = Number.parseFloat(isY ? styles.paddingBottom : styles.paddingRight)
        const contentScrollRange = Math.max(0, scrollRange - (trailingPadding || 0))
        const scrollPos = isY ? node.scrollTop : node.scrollLeft
        let remainingContent = Math.max(0, contentScrollRange - scrollPos)

        /**
         * With a selector the measure is the last visible item rather than the scroll range, which
         * is what stops a sticky footer or an absolutely positioned child from holding a fade open.
         */
        if (contentSelector) {
          const elements = node.querySelectorAll<HTMLElement>(contentSelector)
          const viewportRect = node.getBoundingClientRect()

          for (let index = elements.length - 1; index >= 0; index -= 1) {
            const element = elements[index]
            /** Skip anything not rendered, so a hidden last child is not the one measured */
            if (element.getClientRects().length === 0) continue

            const contentRect = element.getBoundingClientRect()
            remainingContent = Math.max(
              0,
              isY
                ? contentRect.bottom - (viewportRect.bottom - (trailingPadding || 0))
                : contentRect.right - (viewportRect.right - (trailingPadding || 0)),
            )
            break
          }
        }

        const scrollable = scrollPos > 1 || remainingContent > 1

        if (scrollable) node.dataset.scrollable = ''
        else delete node.dataset.scrollable

        /** Each edge fades in over the first RAMP pixels of travel available to it, then holds */
        if (scrollable) {
          const start = MASK_HEIGHT * easeOutCubic(clamp01(scrollPos / RAMP))
          const end = MASK_HEIGHT * easeOutCubic(clamp01(remainingContent / RAMP))

          if (isY) {
            node.style.setProperty('--scroll-fade-top-height', `${start}px`)
            node.style.setProperty('--scroll-fade-bottom-height', `${end}px`)
          } else {
            node.style.setProperty('--scroll-fade-left-width', `${start}px`)
            node.style.setProperty('--scroll-fade-right-width', `${end}px`)
          }
        } else {
          if (isY) {
            node.style.removeProperty('--scroll-fade-top-height')
            node.style.removeProperty('--scroll-fade-bottom-height')
          } else {
            node.style.removeProperty('--scroll-fade-left-width')
            node.style.removeProperty('--scroll-fade-right-width')
          }
        }
      }

      refresh.current = paint

      const schedule = () => {
        cancelAnimationFrame(frame)
        frame = requestAnimationFrame(paint)
      }

      paint()

      node.addEventListener('scroll', schedule, { passive: true })

      /** Resizing changes what fits */
      const resizeObserver = new ResizeObserver(schedule)
      resizeObserver.observe(node)

      /** Filtering a list changes what there is to fit, without either a scroll or a resize */
      const mutationObserver = new MutationObserver(schedule)
      mutationObserver.observe(node, { childList: true, subtree: true })

      teardown.current = () => {
        node.removeEventListener('scroll', schedule)
        resizeObserver.disconnect()
        mutationObserver.disconnect()
        cancelAnimationFrame(frame)
        refresh.current = () => undefined
        delete node.dataset.scrollable
        if (axis === 'y') {
          node.style.removeProperty('--scroll-fade-top-height')
          node.style.removeProperty('--scroll-fade-bottom-height')
        } else {
          node.style.removeProperty('--scroll-fade-left-width')
          node.style.removeProperty('--scroll-fade-right-width')
        }
      }
    },
    [axis, contentSelector],
  )

  const refreshScrollOverflow = useCallback(() => refresh.current(), [])

  return { refreshScrollOverflow, scrollRef }
}
