'use client'

import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import {
  REVEAL_BOW,
  REVEAL_BOW_PEAK,
  REVEAL_COUNT_MS,
  REVEAL_CURTAIN_MS,
  REVEAL_EASE,
  REVEAL_HOLD_MS,
  REVEAL_LEAD_MS,
} from '@/constants/ui'
import { cn } from '@/utils/utils'

/** Fast at first and slowing toward the end, which is how a real load tends to feel */
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3

/**
 * The opening screen: a counter running to 100, then a curtain that drops away to show the page.
 *
 * The count is driven off elapsed time on each frame rather than off a fixed step, so it takes the
 * same length of time regardless of the frame rate it gets. Scrolling is held for the duration so
 * the page cannot be moved underneath the curtain, and restoring it is guarded, since it has to
 * happen whether the sequence finishes or the component is torn down partway through.
 *
 * With reduced motion the whole thing is skipped and the page is shown immediately.
 */
export function InitialLoader() {
  const [count, setCount] = useState(1)
  const [isFinished, setIsFinished] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) {
      const timer = setTimeout(() => setIsFinished(true), 0)
      return () => clearTimeout(timer)
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    let overflowRestored = false
    const restoreOverflow = () => {
      if (overflowRestored) return
      overflowRestored = true
      document.body.style.overflow = originalOverflow
    }

    let animationFrameId: number
    const startTime = performance.now()

    const tick = (now: number) => {
      const elapsed = now - startTime

      if (elapsed < REVEAL_COUNT_MS) {
        setCount(Math.min(100, Math.floor(easeOutCubic(elapsed / REVEAL_COUNT_MS) * 99) + 1))
        animationFrameId = requestAnimationFrame(tick)
        return
      }

      setCount(100)

      if (elapsed < REVEAL_COUNT_MS + REVEAL_HOLD_MS) {
        animationFrameId = requestAnimationFrame(tick)
        return
      }

      setIsFinished(true)
      restoreOverflow()
    }

    animationFrameId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(animationFrameId)
      restoreOverflow()
    }
  }, [prefersReducedMotion])

  const displayCount = count < 10 ? `0${count}` : `${count}`

  return (
    <AnimatePresence>
      {!isFinished && (
        <m.div
          key="initial-loader"
          aria-hidden="true"
          exit={{
            y: '100%',
            transition: {
              duration: REVEAL_CURTAIN_MS / 1000,
              ease: REVEAL_EASE,
              delay: REVEAL_LEAD_MS / 1000,
            },
          }}
          className={cn(
            'fixed inset-0 z-[9999] flex items-center justify-center bg-background select-none',
            isFinished ? 'pointer-events-none' : 'pointer-events-auto',
          )}
        >
          <m.div
            initial={{ height: '0%', opacity: 0 }}
            animate={
              isFinished
                ? { height: ['0%', REVEAL_BOW, '0%'], opacity: 1 }
                : { height: '0%', opacity: 0 }
            }
            transition={{
              height: {
                duration: REVEAL_CURTAIN_MS / 1000,
                delay: REVEAL_LEAD_MS / 1000,
                times: [0, REVEAL_BOW_PEAK, 1],
                ease: 'easeInOut',
              },
              opacity: { duration: 0.2, ease: 'easeOut', delay: REVEAL_LEAD_MS / 1000 },
            }}
            className="pointer-events-none absolute inset-x-0 bottom-full bg-background"
            style={{
              borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
              boxShadow: `0 -1px 0 0 color-mix(in oklab, var(--primary) 38%, transparent),
                          0 -10px 30px -6px color-mix(in oklab, var(--primary) 10%, transparent)`,
            }}
          />

          <m.span
            initial={{ opacity: 0 }}
            animate={{ opacity: isFinished ? 0 : 1 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="font-mono text-xs font-light tracking-[0.25em] text-primary tabular-nums [font-feature-settings:'liga'_0,'calt'_0] [font-variant-ligatures:none]"
            suppressHydrationWarning
          >
            {displayCount}
          </m.span>
        </m.div>
      )}
    </AnimatePresence>
  )
}
