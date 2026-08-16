'use client'

import { useEffect, useRef } from 'react'
import { prefersReducedMotion, subscribeToReducedMotion } from '@/utils/motion'

/** Limit canvas updates to ~40 FPS to reduce continuous background work. */
const BACKGROUND_FRAME_INTERVAL = 1000 / 40

/** Debounce resize, zoom, and orientation events before checking whether to regrow. */
const BACKGROUND_RESIZE_DEBOUNCE_MS = 180

/** Cap DPR because higher values significantly increase canvas memory usage. */
const MAX_BACKGROUND_DPR = 2

/** Prevent extremely large backing canvases on high-resolution displays. */
const MAX_BACKGROUND_PIXELS = 10_000_000

/** Regrow after a meaningful viewport size change. */
const REGROW_SIZE_RATIO = 0.02

/** Fallback tolerance for mobile browsers where browser chrome changes viewport height. */
const MOBILE_FALLBACK_HEIGHT_RATIO = 0.25

/** Regrow when the effective canvas pixel ratio changes enough to matter. */
const REGROW_PIXEL_RATIO_STEP = 0.01

/** Treat the viewport as compact when its shorter edge is below this value. */
const SMALL_VIEWPORT_EDGE = 500

const HALF_TURN = Math.PI
const QUARTER_TURN = Math.PI / 2
const BRANCH_SPREAD = Math.PI / 12
const BRANCH_COLOR = '#88888825'
const BRANCH_LENGTH = 6

/** Preserve the original ArtPlum higher continuation rate during early growth. */
const MIN_BRANCH = 30

/** Prevent a primary root from occasionally terminating as a tiny speck. */
const MIN_TRUNK_SEGMENTS = 12
const MIN_TRUNK_SEGMENT_LENGTH = 0.75

/** Safety limits for unusually dense random growth. */
const MAX_SEGMENTS_DESKTOP = 60_000
const MAX_SEGMENTS_MOBILE = 30_000

/** Prevent reduced-motion rendering from blocking indefinitely. */
const STATIC_FRAME_LIMIT = 600

type Step = () => void

/** Convert a distance and angle into the next canvas coordinate. */
function polarToCartesian(x: number, y: number, radius: number, angle: number) {
  return [x + radius * Math.cos(angle), y + radius * Math.sin(angle)] as const
}

/** Choose a DPR that balances sharpness against the canvas pixel budget. */
function getBackgroundPixelRatio(width: number, height: number, devicePixelRatio = 1) {
  const budgetRatio = Math.sqrt(MAX_BACKGROUND_PIXELS / Math.max(1, width * height))
  return Math.min(Math.max(devicePixelRatio, 1), MAX_BACKGROUND_DPR, budgetRatio)
}

/**
 * Procedural branching background. Branches grow inward from the viewport edges and are masked away
 * from the centre.
 *
 * Inspired by Anthony Fu's ArtPlum, reimplemented here in React on a canvas.
 *
 * Anthony Fu: https://antfu.me
 * Source: https://github.com/antfu/antfu.me
 */
export function BranchingBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const random = Math.random
    let reducedMotion = prefersReducedMotion()

    /** Dimensions the current procedural drawing was generated for. */
    let width = 1
    let height = 1
    let pixelRatio = 1
    let isSmallViewport = false
    let maxSegments = MAX_SEGMENTS_DESKTOP

    /** Deferred growth operations waiting to run in future animation frames. */
    let steps: Step[] = []
    let segmentCount = 0

    let animationFrame = 0
    let resizeTimer = 0
    let lastTime = 0
    let running = false
    let destroyed = false

    /** 100lvh remains stable while mobile browser chrome expands or collapses. */
    const supportsLargeViewportUnits = CSS.supports('height', '100lvh')

    /** Only coarse-pointer devices need the larger legacy mobile height tolerance. */
    const likelyTouchViewport = window.matchMedia('(pointer: coarse)').matches

    /** Stop the RAF loop without discarding queued growth steps. */
    const stop = () => {
      if (!running) return
      running = false
      cancelAnimationFrame(animationFrame)
    }

    /**
     * Draw one segment and enqueue its possible descendants.
     *
     * `counter` remains shared across descendants to preserve the original ArtPlum
     * branching probabilities. `trunkRemaining` is separate so only one primary
     * path receives a minimum visible length.
     */
    const drawStep = (
      x: number,
      y: number,
      angle: number,
      counter: { value: number } = { value: 0 },
      trunkRemaining = MIN_TRUNK_SEGMENTS,
    ) => {
      if (segmentCount >= maxSegments) return

      const guaranteedTrunk = trunkRemaining > 0
      const minLength = guaranteedTrunk ? MIN_TRUNK_SEGMENT_LENGTH : 0
      const length = minLength + random() * (BRANCH_LENGTH - minLength)

      counter.value += 1
      segmentCount += 1

      const [nextX, nextY] = polarToCartesian(x, y, length, angle)

      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(nextX, nextY)
      ctx.stroke()

      /** Stop growing once the branch is well outside the viewport. */
      if (nextX < -100 || nextX > width + 100 || nextY < -100 || nextY > height + 100) return

      const leftAngle = angle + random() * BRANCH_SPREAD
      const rightAngle = angle - random() * BRANCH_SPREAD
      const rate = counter.value <= MIN_BRANCH ? 0.8 : 0.5
      const nextTrunk = Math.max(0, trunkRemaining - 1)

      /** One descendant carries the guaranteed primary trunk. */
      if (trunkRemaining > 1 || random() < rate) {
        steps.push(() => drawStep(nextX, nextY, leftAngle, counter, nextTrunk))
      }

      /** Secondary branches retain the original stochastic behavior. */
      if (random() < rate) {
        steps.push(() => drawStep(nextX, nextY, rightAngle, counter, 0))
      }
    }

    /**
     * Advance one generation of the tree.
     * Each queued step has a 50% chance of being postponed, matching ArtPlum.
     */
    const advance = () => {
      const queued = steps
      steps = []

      for (const step of queued) {
        if (segmentCount >= maxSegments) break
        if (random() < 0.5) steps.push(step)
        else step()
      }

      if (segmentCount >= maxSegments) steps = []
      return steps.length > 0
    }

    /** RAF loop; actual canvas work is throttled by BACKGROUND_FRAME_INTERVAL. */
    function loop(time: number) {
      if (destroyed || !running) return

      if (time - lastTime >= BACKGROUND_FRAME_INTERVAL) {
        lastTime = time

        if (!advance()) {
          stop()
          return
        }
      }

      animationFrame = requestAnimationFrame(loop)
    }

    /** Start drawing only when animation is allowed and queued work remains. */
    const start = () => {
      if (running || destroyed || reducedMotion || document.hidden || steps.length === 0) return

      running = true
      lastTime = performance.now()
      animationFrame = requestAnimationFrame(loop)
    }

    /** Keep root positions away from the extreme corners. */
    const randomMiddle = () => random() * 0.6 + 0.2

    /** Measure the visible canvas and calculate an appropriate backing DPR. */
    const measureCanvas = () => {
      const bounds = canvas.getBoundingClientRect()
      const nextWidth = Math.max(1, Math.ceil(bounds.width || window.innerWidth))
      const nextHeight = Math.max(1, Math.ceil(bounds.height || window.innerHeight))
      const nextPixelRatio = getBackgroundPixelRatio(
        nextWidth,
        nextHeight,
        window.devicePixelRatio || 1,
      )

      return {
        width: nextWidth,
        height: nextHeight,
        pixelRatio: nextPixelRatio,
        canvasWidth: Math.ceil(nextWidth * nextPixelRatio),
        canvasHeight: Math.ceil(nextHeight * nextPixelRatio),
      }
    }

    /**
     * Resize the backing canvas and restore context settings.
     * Assigning canvas dimensions also clears the canvas and resets the context state.
     */
    const sizeCanvas = (metrics: ReturnType<typeof measureCanvas>) => {
      width = metrics.width
      height = metrics.height
      pixelRatio = metrics.pixelRatio
      isSmallViewport = Math.min(width, height) < SMALL_VIEWPORT_EDGE
      maxSegments = isSmallViewport ? MAX_SEGMENTS_MOBILE : MAX_SEGMENTS_DESKTOP

      canvas.width = metrics.canvasWidth
      canvas.height = metrics.canvasHeight

      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      ctx.lineWidth = 1
      ctx.strokeStyle = BRANCH_COLOR
    }

    /** Return the proportional difference between two measurements. */
    const relativeDifference = (current: number, previous: number) =>
      Math.abs(current - previous) / Math.max(1, previous)

    /**
     * Regrow on real viewport changes, zoom, orientation changes, or DPR changes.
     * Normal mobile browser-chrome movement should not trigger regeneration.
     */
    const needsRegrowth = (metrics: ReturnType<typeof measureCanvas>) => {
      if (width <= 1 || height <= 1) return true
      if (Math.abs(metrics.pixelRatio - pixelRatio) > REGROW_PIXEL_RATIO_STEP) return true
      if (relativeDifference(metrics.width, width) > REGROW_SIZE_RATIO) return true

      const heightThreshold =
        supportsLargeViewportUnits || !likelyTouchViewport
          ? REGROW_SIZE_RATIO
          : MOBILE_FALLBACK_HEIGHT_RATIO

      return relativeDifference(metrics.height, height) > heightThreshold
    }

    /** Complete queued growth synchronously for users who prefer reduced motion. */
    const renderStatic = () => {
      let frames = 0

      while (steps.length > 0 && frames < STATIC_FRAME_LIMIT && segmentCount < maxSegments) {
        advance()
        frames += 1
      }

      steps = []
    }

    /** Generate a fresh composition for the current viewport. */
    const restart = (force = false) => {
      if (destroyed) return

      const metrics = measureCanvas()
      if (!force && !needsRegrowth(metrics)) return

      stop()
      sizeCanvas(metrics)
      segmentCount = 0

      const fromTop = () => drawStep(randomMiddle() * width, -5, QUARTER_TURN)
      const fromBottom = () => drawStep(randomMiddle() * width, height + 5, -QUARTER_TURN)
      const fromLeft = () => drawStep(-5, randomMiddle() * height, 0)
      const fromRight = () => drawStep(width + 5, randomMiddle() * height, HALF_TURN)

      if (isSmallViewport) {
        /**
         * Small screens use three roots: both long sides plus one randomly
         * selected short side for good coverage without desktop-level density.
         */
        const portrait = height >= width
        const longSides = portrait ? [fromLeft, fromRight] : [fromTop, fromBottom]
        const shortSides = portrait ? [fromTop, fromBottom] : [fromLeft, fromRight]

        steps = [...longSides, shortSides[random() < 0.5 ? 0 : 1]]
      } else {
        steps = [fromTop, fromBottom, fromLeft, fromRight]
      }

      if (reducedMotion) {
        renderStatic()
        return
      }

      start()
    }

    /** Collapse bursts of resize, zoom, and orientation events into one final check. */
    const scheduleRestart = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => restart(), BACKGROUND_RESIZE_DEBOUNCE_MS)
    }

    /**
     * Track DPR changes caused by browser zoom or moving the window between displays.
     * The media query is re-armed after every change because it watches one DPR value.
     */
    let densityQuery: MediaQueryList | null = null

    function armDensityWatch() {
      densityQuery?.removeEventListener('change', onDensityChange)
      densityQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`)
      densityQuery.addEventListener('change', onDensityChange)
    }

    function onDensityChange() {
      armDensityWatch()
      scheduleRestart()
    }

    /** Respect reduced-motion changes without leaving a half-grown drawing frozen. */
    const unsubscribeReducedMotion = subscribeToReducedMotion((reduced) => {
      reducedMotion = reduced

      if (reduced) {
        stop()
        if (steps.length > 0) renderStatic()
        return
      }

      if (steps.length > 0) start()
      else restart(true)
    })

    /** Pause background work while the tab is hidden and resume when visible. */
    const onVisibilityChange = () => {
      if (document.hidden) stop()
      else start()
    }

    restart(true)
    armDensityWatch()

    window.addEventListener('resize', scheduleRestart)
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      destroyed = true
      stop()
      window.clearTimeout(resizeTimer)

      densityQuery?.removeEventListener('change', onDensityChange)
      unsubscribeReducedMotion()

      window.removeEventListener('resize', scheduleRestart)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 size-full print:hidden"
      style={{
        /** Stable through mobile browser chrome expansion and collapse. */
        height: '100lvh',
        maskImage: 'radial-gradient(circle, transparent, black)',
        WebkitMaskImage: 'radial-gradient(circle, transparent, black)',
      }}
    />
  )
}
