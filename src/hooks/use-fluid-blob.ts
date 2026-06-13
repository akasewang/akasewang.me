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
 * Custom hook that generates a nonrepeating, hardware accelerated fluid morph animation.
 * Uses Framer Motion's imperative `animate()` API to completely bypass React rerenders.
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

    let currentRotate = rotate.get()
    let morphTimer: ReturnType<typeof setTimeout>
    let spinTimer: ReturnType<typeof setTimeout>
    let radiusControls: { stop: () => void } | undefined
    let scaleControls: { stop: () => void } | undefined
    let rotateControls: { stop: () => void } | undefined

    /** Drives the fluid shape morph at the fastest cadence so the blob feels alive. */
    const morph = () => {
      hasStartedRef.current = true
      const duration = (intervalMs * rand(0.5, 0.9)) / 1000
      radiusControls = animate(borderRadius, randomBorderRadius(), { duration, ease: 'easeInOut' })
      scaleControls = animate(scale, rand(0.95, 1.07), { duration, ease: 'easeInOut' })
      morphTimer = setTimeout(morph, duration * 1000)
    }

    /** Drives rotation on a slower cadence so spin doesn't overpower the morph. */
    const spin = () => {
      const duration = (intervalMs * rand(1.6, 2.4)) / 1000
      currentRotate += rand(25, 90) * (Math.random() < 0.25 ? -1 : 1)
      rotateControls = animate(rotate, currentRotate, { duration, ease: 'easeInOut' })
      spinTimer = setTimeout(spin, duration * 1000)
    }

    if (randomStart || hasStartedRef.current) {
      morph()
      spin()
    } else {
      morphTimer = setTimeout(morph, 2000)
      spinTimer = setTimeout(spin, 2000)
    }

    return () => {
      clearTimeout(morphTimer)
      clearTimeout(spinTimer)
      radiusControls?.stop()
      scaleControls?.stop()
      rotateControls?.stop()
    }
  }, [intervalMs, randomStart, shouldAnimate, borderRadius, rotate, scale])

  return { borderRadius, rotate, scale }
}
