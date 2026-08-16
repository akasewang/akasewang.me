'use client'

import { m, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import {
  REVEAL_COUNT_IN_MS,
  REVEAL_COUNT_OUT_EASE,
  REVEAL_COUNT_OUT_MS,
  REVEAL_DIGIT_STAGGER_MS,
  REVEAL_FADE_EASE,
  REVEAL_FADE_MS,
  REVEAL_FOCUS_BLUR_PX,
  REVEAL_FOCUS_MS,
} from '@/constants/ui'
import {
  getInitialLoaderCount,
  INITIAL_LOADER_FINAL_COUNT,
  INITIAL_LOADER_TIMELINE,
} from '@/utils/initial-loader'

/** Both spellings read the one variable, so Safari's prefix needs no second animation */
const FOCUS_FILTER = 'blur(var(--reveal-focus))'

/**
 * The opening screen: a counter to 100, then a fade of three overlapping parts. The digits thin out
 * one after another, the veil follows a beat later, and the page resolves out of a backdrop blur
 * that clears first so nothing sharpens in full view.
 *
 * The blurred layer is mounted only for the fade, and interaction is held until the veil is gone so
 * nobody activates a page they cannot see. Reduced motion skips all of it.
 */
export function InitialLoader() {
  const [count, setCount] = useState(1)
  const [isCountLeaving, setIsCountLeaving] = useState(false)
  const [isFading, setIsFading] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const hasFinishedRef = useRef(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    /** A live preference change after the one-shot sequence must not restart it behind the page */
    if (hasFinishedRef.current) return

    if (prefersReducedMotion) {
      const timer = setTimeout(() => {
        hasFinishedRef.current = true
        setIsFinished(true)
      }, 0)
      return () => clearTimeout(timer)
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    /**
     * The overlay catches pointers, while this capture listener keeps page-level shortcuts and
     * keyboard activation from reaching the content behind it. Modified browser shortcuts retain
     * their native behaviour; only propagation into the site is stopped for those combinations.
     */
    const holdKeyboardInteraction = (event: KeyboardEvent) => {
      event.stopImmediatePropagation()
      if (!event.ctrlKey && !event.metaKey && !event.altKey) event.preventDefault()
    }
    window.addEventListener('keydown', holdKeyboardInteraction, true)

    let interactionRestored = false
    const restoreInteraction = () => {
      if (interactionRestored) return
      interactionRestored = true
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', holdKeyboardInteraction, true)
    }

    let animationFrameId: number
    let displayedCount = 1
    let countLeaving = false
    let fadeStarted = false
    const startTime = performance.now()

    const tick = (now: number) => {
      const elapsed = now - startTime

      if (elapsed < INITIAL_LOADER_TIMELINE.countEndsAt) {
        const nextCount = getInitialLoaderCount(elapsed)

        if (nextCount !== displayedCount) {
          displayedCount = nextCount
          setCount(nextCount)
        }

        animationFrameId = requestAnimationFrame(tick)
        return
      }

      if (displayedCount !== INITIAL_LOADER_FINAL_COUNT) {
        displayedCount = INITIAL_LOADER_FINAL_COUNT
        setCount(INITIAL_LOADER_FINAL_COUNT)
      }

      if (!countLeaving && elapsed >= INITIAL_LOADER_TIMELINE.countOutAt) {
        countLeaving = true
        setIsCountLeaving(true)
      }

      if (!fadeStarted && elapsed >= INITIAL_LOADER_TIMELINE.fadeAt) {
        fadeStarted = true
        setIsFading(true)
      }

      if (elapsed < INITIAL_LOADER_TIMELINE.finishAt) {
        animationFrameId = requestAnimationFrame(tick)
        return
      }

      hasFinishedRef.current = true
      restoreInteraction()
      setIsFinished(true)
    }

    animationFrameId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(animationFrameId)
      restoreInteraction()
    }
  }, [prefersReducedMotion])

  const displayCount = count < 10 ? `0${count}` : `${count}`

  if (isFinished) return null

  return (
    <div
      aria-hidden="true"
      className="pointer-events-auto fixed inset-0 z-[9999] select-none motion-reduce:hidden"
    >
      {isFading && (
        <m.div
          initial={{ '--reveal-focus': `${REVEAL_FOCUS_BLUR_PX}px` }}
          animate={{ '--reveal-focus': '0px' }}
          transition={{ duration: REVEAL_FOCUS_MS / 1000, ease: REVEAL_FADE_EASE }}
          className="absolute inset-0"
          style={{ backdropFilter: FOCUS_FILTER, WebkitBackdropFilter: FOCUS_FILTER }}
        />
      )}
      <m.div
        initial={{ opacity: 1 }}
        animate={{ opacity: isFading ? 0 : 1 }}
        transition={{ duration: isFading ? REVEAL_FADE_MS / 1000 : 0, ease: REVEAL_FADE_EASE }}
        className="absolute inset-0 bg-background"
        /** Keeps the veil on a layer of its own, so fading it repaints nothing but itself */
        style={{ willChange: 'opacity' }}
      />
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: REVEAL_COUNT_IN_MS / 1000, ease: 'easeOut' }}
        className="absolute inset-0 flex items-center justify-center font-mono text-xs font-light tracking-[0.25em] text-primary tabular-nums [font-feature-settings:'liga'_0,'calt'_0] [font-variant-ligatures:none]"
      >
        {/**
         * A digit to an element, so they can leave a beat apart. The advance width is fixed by the
         * tabular figures and the tracking sits after each character either way, so splitting the
         * number up leaves it looking exactly as it did whole.
         */}
        {displayCount.split('').map((digit, index) => (
          <m.span
            key={index}
            initial={false}
            animate={
              isCountLeaving
                ? { opacity: 0, filter: 'blur(5px)' }
                : { opacity: 1, filter: 'blur(0px)' }
            }
            transition={{
              duration: REVEAL_COUNT_OUT_MS / 1000,
              ease: REVEAL_COUNT_OUT_EASE,
              delay: isCountLeaving ? (index * REVEAL_DIGIT_STAGGER_MS) / 1000 : 0,
            }}
            suppressHydrationWarning
          >
            {digit}
          </m.span>
        ))}
      </m.div>
    </div>
  )
}
