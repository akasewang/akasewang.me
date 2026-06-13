'use client'

import { useEffect, useRef } from 'react'

/** Pointer position in local (CSS pixel) canvas coordinates plus its per frame velocity. */
export interface Pointer {
  /** Local x coordinate, in CSS pixels. */
  x: number
  /** Local y coordinate, in CSS pixels. */
  y: number
  /** Horizontal movement since the previous frame. */
  vx: number
  /** Vertical movement since the previous frame. */
  vy: number
  /**
   * Whether the pointer is currently over the canvas. {@link Pointer.x}/{@link Pointer.y} are
   * retained after it leaves, so experiments can ease their own influence back down from the last
   * known position for a smooth exit.
   */
  active: boolean
}

/** Per frame drawing context handed to an {@link useAnimatedCanvas} callback. */
export interface CanvasFrame {
  /** The 2D rendering context, already transformed for the device pixel ratio. */
  ctx: CanvasRenderingContext2D
  /** Logical (CSS pixel) width of the canvas. */
  width: number
  /** Logical (CSS pixel) height of the canvas. */
  height: number
  /** Device pixel ratio the backing store was scaled by, capped at 2. */
  dpr: number
  /** Seconds elapsed since the loop started. */
  time: number
  /** Seconds elapsed since the previous frame, clamped to avoid jumps after pauses. */
  dt: number
  /** Pointer state in logical pixels. */
  pointer: Pointer
}

/** Optional lifecycle hooks for {@link useAnimatedCanvas}. */
interface AnimatedCanvasOptions {
  /** Runs after every resize with the fresh logical size, before the next frame draws. */
  onResize?: (size: { width: number; height: number; ctx: CanvasRenderingContext2D }) => void
}

/**
 * Wires a `<canvas>` up to a self managing animation loop.
 *
 * Handles the boilerplate every canvas experiment needs: HiDPI backing store scaling,
 * `ResizeObserver` driven sizing, pointer tracking in local coordinates and a render loop that
 * pauses whenever the canvas scrolls out of view or the tab is hidden so a wall of live tiles
 * never burns the main thread. The `frame` callback is held in a ref so it always reads fresh
 * closure state without tearing down the loop, and motion is skipped under `prefers-reduced-motion`
 * after painting a single static frame.
 *
 * @param frame - Draw callback invoked once per animation frame.
 * @param options - Optional resize lifecycle hook.
 * @returns A ref to attach to the target `<canvas>` element.
 */
export function useAnimatedCanvas(
  frame: (f: CanvasFrame) => void,
  options: AnimatedCanvasOptions = {},
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const frameRef = useRef(frame)
  frameRef.current = frame
  const onResizeRef = useRef(options.onResize)
  onResizeRef.current = options.onResize

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let running = false
    let visible = true
    let last = performance.now()
    const start = last
    let width = 0
    let height = 0
    let dpr = 1

    /** Tracked pointer with private previous position fields for velocity. */
    const pointer = { x: 0, y: 0, vx: 0, vy: 0, active: false, px: 0, py: 0, seen: false }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      const nextDpr = Math.min(window.devicePixelRatio || 1, 2)
      /** Skip the costly resize path (and the consumer's onResize) when nothing actually changed,
       * e.g. the ResizeObserver's duplicate mount callback. */
      if (rect.width === width && rect.height === height && nextDpr === dpr) return
      dpr = nextDpr
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      onResizeRef.current?.({ width, height, ctx })
    }

    const render = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30)
      last = now
      pointer.vx = pointer.seen ? pointer.x - pointer.px : 0
      pointer.vy = pointer.seen ? pointer.y - pointer.py : 0
      pointer.px = pointer.x
      pointer.py = pointer.y
      frameRef.current({ ctx, width, height, dpr, time: (now - start) / 1000, dt, pointer })
    }

    const loop = (now: number) => {
      render(now)
      raf = requestAnimationFrame(loop)
    }

    const startLoop = () => {
      if (running) return
      running = true
      last = performance.now()
      raf = requestAnimationFrame(loop)
    }
    const stopLoop = () => {
      running = false
      cancelAnimationFrame(raf)
    }
    const sync = () => {
      if (visible && !document.hidden) startLoop()
      else stopLoop()
    }

    const onMove = (e: PointerEvent) => {
      /** `offsetX/Y` are already in the canvas' local space, avoiding a layout read per move. */
      pointer.x = e.offsetX
      pointer.y = e.offsetY
      if (!pointer.seen) {
        pointer.px = pointer.x
        pointer.py = pointer.y
        pointer.seen = true
      }
      pointer.active = true
    }
    const onLeave = () => {
      pointer.active = false
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        sync()
      },
      { threshold: 0 },
    )
    io.observe(canvas)

    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerleave', onLeave)
    document.addEventListener('visibilitychange', sync)

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      /** Paint one static frame so the tile is never blank for reduced motion users. */
      render(performance.now())
    } else {
      sync()
    }

    return () => {
      stopLoop()
      ro.disconnect()
      io.disconnect()
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', sync)
    }
  }, [])

  return canvasRef
}
