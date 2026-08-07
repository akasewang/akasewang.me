'use client'

import { useEffect, useRef } from 'react'
import { createNoise3D } from 'simplex-noise'
import { prefersReducedMotion } from '@/utils/motion'

const SCALE = 200
const LENGTH = 5
const SPACING = 15
const MAX_DPR = 2
const TWO_PI = Math.PI * 2

/**
 * The field of drifting dots behind every page.
 *
 * Drawn on a canvas rather than as elements, there being far too many to make each one a node.
 * Each dot's offset comes from simplex noise sampled over time, so the field moves as one field
 * rather than as points wandering independently, and the whole thing stops while the tab is hidden
 * or where reduced motion is asked for.
 */
export function DotGridBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (container == null) return

    const canvas = document.createElement('canvas')
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    const ctx = canvas.getContext('2d')
    if (ctx == null) return
    container.appendChild(canvas)

    const noise3d = createNoise3D()
    const prefersReduced = prefersReducedMotion()

    let w = window.innerWidth
    let h = window.innerHeight
    let dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
    let frame = 0
    let destroyed = false
    let running = false

    const sprite = document.createElement('canvas')
    let spriteSize = 0
    const drawSprite = () => {
      const radius = 1
      spriteSize = Math.ceil(radius * 2 * dpr) + 2
      sprite.width = spriteSize
      sprite.height = spriteSize
      const sctx = sprite.getContext('2d')
      if (sctx == null) return
      sctx.clearRect(0, 0, spriteSize, spriteSize)
      sctx.fillStyle =
        getComputedStyle(document.documentElement).getPropertyValue('--dot-color').trim() ||
        'oklch(0.34 0 0)'
      sctx.beginPath()
      sctx.arc(spriteSize / 2, spriteSize / 2, radius * dpr, 0, TWO_PI)
      sctx.fill()
    }

    const resizeCanvas = () => {
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
    }

    const points: { x: number; y: number; nx: number; ny: number; opacity: number }[] = []
    const buildPoints = () => {
      points.length = 0
      for (let x = -SPACING / 2; x < w + SPACING; x += SPACING) {
        for (let y = -SPACING / 2; y < h + SPACING; y += SPACING) {
          points.push({ x, y, nx: x / SCALE, ny: y / SCALE, opacity: Math.random() * 0.42 + 0.48 })
        }
      }
    }

    const renderFrame = () => {
      const t = Date.now() / 10000
      const t2 = t * 2
      const halfDev = spriteSize / 2
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of points) {
        const rad = (noise3d(p.nx, p.ny, t) - 0.5) * TWO_PI
        const len = (noise3d(p.nx, p.ny, t2) + 0.5) * LENGTH
        const cos = Math.cos(rad)
        const cx = p.x + cos * len
        const cy = p.y + Math.sin(rad) * len
        ctx.globalAlpha = (Math.abs(cos) * 0.76 + 0.24) * p.opacity
        ctx.drawImage(sprite, cx * dpr - halfDev, cy * dpr - halfDev)
      }
      ctx.globalAlpha = 1
    }

    const loop = () => {
      if (destroyed || !running) return
      renderFrame()
      frame = requestAnimationFrame(loop)
    }

    const start = () => {
      if (destroyed || running || prefersReduced || document.hidden) return
      running = true
      frame = requestAnimationFrame(loop)
    }

    const stop = () => {
      running = false
      cancelAnimationFrame(frame)
    }

    const onResize = () => {
      w = window.innerWidth
      h = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      drawSprite()
      resizeCanvas()
      buildPoints()
      if (prefersReduced) renderFrame()
    }

    const onVisibility = () => {
      if (document.hidden) stop()
      else start()
    }

    drawSprite()
    resizeCanvas()
    buildPoints()

    if (prefersReduced) renderFrame()
    else start()

    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      destroyed = true
      stop()
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
      canvas.remove()
    }
  }, [])

  return <div ref={containerRef} aria-hidden className="pointer-events-none fixed inset-0 -z-10" />
}
