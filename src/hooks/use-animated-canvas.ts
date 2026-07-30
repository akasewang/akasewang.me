'use client'

import { useEffect, useEffectEvent, useRef } from 'react'

interface Pointer {
  x: number
  y: number
  vx: number
  vy: number
  active: boolean
}

export interface CanvasFrame {
  ctx: CanvasRenderingContext2D
  width: number
  height: number
  dpr: number
  time: number
  dt: number
  pointer: Pointer
}

interface AnimatedCanvasOptions {
  onResize?: (size: { width: number; height: number; ctx: CanvasRenderingContext2D }) => void
}

/**
 * Runs a draw callback on every frame against a canvas kept in step with its box and pixel ratio,
 * handing it elapsed time, a delta and pointer velocity. The loop only turns while the canvas is on
 * screen and the tab is visible, and reduced motion gets one static frame instead.
 */
export function useAnimatedCanvas(
  frame: (f: CanvasFrame) => void,
  options: AnimatedCanvasOptions = {},
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const drawFrame = useEffectEvent(frame)
  const notifyResize = useEffectEvent(
    (size: { width: number; height: number; ctx: CanvasRenderingContext2D }) => {
      options.onResize?.(size)
    },
  )

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

    const pointer = { x: 0, y: 0, vx: 0, vy: 0, active: false, px: 0, py: 0, seen: false }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      /** Capped at 2, past which the extra pixels cost more than they show */
      const nextDpr = Math.min(window.devicePixelRatio || 1, 2)

      if (rect.width === width && rect.height === height && nextDpr === dpr) return
      dpr = nextDpr
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      notifyResize({ width, height, ctx })
    }

    const render = (now: number) => {
      /** Clamped so a backgrounded tab does not resume with one enormous step */
      const dt = Math.min((now - last) / 1000, 1 / 30)
      last = now
      pointer.vx = pointer.seen ? pointer.x - pointer.px : 0
      pointer.vy = pointer.seen ? pointer.y - pointer.py : 0
      pointer.px = pointer.x
      pointer.py = pointer.y
      drawFrame({ ctx, width, height, dpr, time: (now - start) / 1000, dt, pointer })
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
