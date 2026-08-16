'use client'

import { useInView, useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { usePageArriving } from '@/hooks/use-page-arrival'

/**
 * Plays a card's video while it is on screen and pauses it otherwise, so a grid of cards only
 * decodes the frames it shows.
 *
 * Playback stays paused during a page slide, where the cards are still moving and being on screen
 * does not yet mean the card has settled.
 */
export function useInViewVideo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [video, setVideo] = useState<HTMLVideoElement | null>(null)

  /** A node change is state because playback effects must clean up when fallback media replaces it. */
  const videoRef = useCallback((node: HTMLVideoElement | null) => {
    setVideo((current) => (current === node ? current : node))
  }, [])

  const isInView = useInView(containerRef, { amount: 0.5 })
  const isArriving = usePageArriving()
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (!video) return

    const syncPlayback = () => {
      if (isArriving || !isInView || document.hidden || shouldReduceMotion) {
        video.pause()
        return
      }

      video.play().catch(() => {})
    }

    syncPlayback()
    document.addEventListener('visibilitychange', syncPlayback)

    return () => {
      document.removeEventListener('visibilitychange', syncPlayback)
      video.pause()
    }
  }, [video, isInView, isArriving, shouldReduceMotion])

  return { containerRef, videoRef }
}
