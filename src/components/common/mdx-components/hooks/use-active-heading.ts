'use client'

import { useEffect, useState } from 'react'
import type { TocItem } from '../utils/parse-toc'

/* React hook that monitors window scroll position to determine and highlight the currently active Table of Contents (TOC) heading */
export function useActiveHeading(items: TocItem[], offset = 120): string {
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    if (!items.length) return

    const headingElements = items
      .map((item) => ({ id: item.id, el: document.getElementById(item.id) }))
      .filter((h): h is { id: string; el: HTMLElement } => h.el !== null)

    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          let current = ''
          const isAtBottom =
            window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10

          if (isAtBottom && headingElements.length > 0) {
            current = headingElements[headingElements.length - 1].id
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
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [items, offset])

  return activeId
}

/* Utility function to smoothly scroll the page to a specific DOM element by ID, applying a configurable Y-offset to account for fixed headers */
export function scrollToHeading(id: string, yOffset = -100): void {
  const element = document.getElementById(id)
  if (element)
    window.scrollTo({
      top: element.getBoundingClientRect().top + window.scrollY + yOffset,
      behavior: 'smooth',
    })
}
