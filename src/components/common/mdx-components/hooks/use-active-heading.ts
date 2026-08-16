'use client'

import { useEffect, useState } from 'react'
import type { TocItem } from '../utils/parse-toc'

/**
 * Which heading the reader is currently under, for marking the matching entry in the contents.
 *
 * Headings are walked from the bottom up and the first one that has passed the offset line wins,
 * so a heading counts as active from the moment it reaches the top of the page rather than when it
 * scrolls out of sight. The last heading is forced active at the very bottom of the page, since a
 * short final section may never reach that line and would otherwise leave the wrong entry marked.
 *
 * Scroll fires far more often than the page can paint, so the work is held to one frame at a time.
 */
export function useActiveHeading(items: TocItem[], offset = 120): string {
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    if (!items.length) return

    /** Resolved once. A heading listed in the contents but missing from the page is dropped here */
    const headingElements = items
      .map((item) => ({ id: item.id, el: document.getElementById(item.id) }))
      .filter((h): h is { id: string; el: HTMLElement } => h.el !== null)

    let ticking = false
    let animationFrameId: number | null = null

    const handleScroll = () => {
      if (!ticking) {
        animationFrameId = window.requestAnimationFrame(() => {
          let current = ''
          const isAtBottom =
            window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10

          if (isAtBottom && headingElements.length > 0) {
            current = headingElements[headingElements.length - 1].id
            /** Walked backwards, so the first match is the last heading to have passed the line */
          } else {
            for (let i = headingElements.length - 1; i >= 0; i--) {
              if (headingElements[i].el.getBoundingClientRect().top <= offset) {
                current = headingElements[i].id
                break
              }
            }
          }

          setActiveId(current)
          ticking = false
          animationFrameId = null
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (animationFrameId !== null) window.cancelAnimationFrame(animationFrameId)
    }
  }, [items, offset])

  return activeId
}

/** Scrolls a heading into view, stopping short of the top so it clears the navbar above it */
export function scrollToHeading(id: string, yOffset = -100): void {
  const element = document.getElementById(id)
  if (element)
    window.scrollTo({
      top: element.getBoundingClientRect().top + window.scrollY + yOffset,
      behavior: 'smooth',
    })
}
