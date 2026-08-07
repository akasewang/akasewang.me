'use client'

import { useInView } from 'framer-motion'
import { useEffect, useRef } from 'react'
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
  const videoRef = useRef<HTMLVideoElement>(null)

  const isInView = useInView(containerRef, { amount: 0.5 })
  const isArriving = usePageArriving()

  useEffect(() => {
    if (!videoRef.current || isArriving) return

    if (isInView) {
      videoRef.current.play().catch(() => {})
    } else {
      videoRef.current.pause()
    }
  }, [isInView, isArriving])

  return { containerRef, videoRef }
}
