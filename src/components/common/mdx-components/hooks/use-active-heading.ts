'use client'

import { useEffect, useState } from 'react'
import type { TocItem } from '../utils/parse-toc'

export function useActiveHeading(items: TocItem[], offset = 120): string {
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    if (!items.length) return

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

export function scrollToHeading(id: string, yOffset = -100): void {
  const element = document.getElementById(id)
  if (element)
    window.scrollTo({
      top: element.getBoundingClientRect().top + window.scrollY + yOffset,
      behavior: 'smooth',
    })
}
