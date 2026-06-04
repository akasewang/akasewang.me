'use client'

import { useEffect, useRef } from 'react'
import { useMotionValue, animate, useReducedMotion, type MotionValue } from 'framer-motion'

/** Motion values produced by {@link useFluidBlob}, bound directly to a blob element's CSS. */
export interface FluidBlobState {
  borderRadius: MotionValue<string>
  rotate: MotionValue<number>
  scale: MotionValue<number>
}

/** Random float in the `[min, max)` range. */
const rand = (min: number, max: number) => Math.random() * (max - min) + min

/** Generates a random asymmetric `border-radius` string for the organic blob shape. */
function randomBorderRadius() {
  const r = () => Math.round(rand(25, 75))
  return `${r()}% ${r()}% ${r()}% ${r()}% / ${r()}% ${r()}% ${r()}% ${r()}%`
}

/**
 * Custom hook that generates a non-repeating, hardware-accelerated fluid morph animation.
 * Uses Framer Motion's imperative `animate()` API to completely bypass React re-renders.
 *
 * @param intervalMs - Base interval for morph cadence.
 * @param randomStart - If true, initializes with random state. If false, starts stable.
 * @param isPlaying - If false, cleanly stops and pauses all tweens to save battery/CPU.
 * @returns {FluidBlobState} MotionValues mapped directly to DOM CSS properties.
 */
export function useFluidBlob(
  intervalMs = 3000,
  randomStart = true,
  isPlaying = true,
): FluidBlobState {
  const prefersReducedMotion = useReducedMotion()
  const shouldAnimate = isPlaying && !prefersReducedMotion

  const borderRadius = useMotionValue(
    randomStart ? randomBorderRadius() : '60% 40% 30% 70% / 60% 30% 70% 40%',
  )
  const rotate = useMotionValue(randomStart ? Math.floor(rand(0, 360)) : 0)
  const scale = useMotionValue(randomStart ? rand(0.96, 1.06) : 1)

  const hasStartedRef = useRef(false)

  useEffect(() => {
    if (!shouldAnimate) return

    let timer: ReturnType<typeof setTimeout>
    let currentRotate = rotate.get()

    let radiusControls: { stop: () => void }
    let rotateControls: { stop: () => void }
    let scaleControls: { stop: () => void }

    const tick = () => {
      hasStartedRef.current = true
      const nextDuration = (intervalMs * rand(0.65, 1.4)) / 1000
      currentRotate += rand(40, 160) * (Math.random() < 0.25 ? -1 : 1)

      radiusControls = animate(borderRadius, randomBorderRadius(), {
        duration: nextDuration,
        ease: 'easeInOut',
      })
      rotateControls = animate(rotate, currentRotate, { duration: nextDuration, ease: 'easeInOut' })
      scaleControls = animate(scale, rand(0.96, 1.06), {
        duration: nextDuration,
        ease: 'easeInOut',
      })

      timer = setTimeout(tick, nextDuration * 1000)
    }

    if (randomStart || hasStartedRef.current) {
      tick()
    } else {
      timer = setTimeout(tick, 2000)
    }

    return () => {
      clearTimeout(timer)
      radiusControls?.stop()
      rotateControls?.stop()
      scaleControls?.stop()
    }
  }, [intervalMs, randomStart, shouldAnimate, borderRadius, rotate, scale])

  return { borderRadius, rotate, scale }
}
