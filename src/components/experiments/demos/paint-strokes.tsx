'use client'

import { useRef } from 'react'
import { type CanvasFrame, useAnimatedCanvas } from '@/hooks/use-animated-canvas'

function brushDab(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  size: number,
  hue: number,
) {
  const bristles = 9
  const normal = angle + Math.PI / 2
  for (let i = 0; i < bristles; i++) {
    const offset = (i / (bristles - 1) - 0.5) * size

    if (Math.random() < 0.12) continue
    const px = x + Math.cos(normal) * offset
    const py = y + Math.sin(normal) * offset
    const r = size * 0.16 * (0.55 + Math.random() * 0.7)
    const light = 52 + Math.random() * 16
    const alpha = 0.05 + Math.random() * 0.08

    ctx.fillStyle = `hsla(${hue}, 70%, ${light}%, ${alpha})`
    ctx.beginPath()
    ctx.ellipse(px, py, r * 1.7, r * 0.55, angle, 0, Math.PI * 2)
    ctx.fill()
  }
}

function brushCurve(
  ctx: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  cx: number,
  cy: number,
  x1: number,
  y1: number,
  size: number,
  hue: number,
) {
  const steps = 80
  let prevX = x0
  let prevY = y0
  for (let i = 1; i <= steps; i++) {
    const t = i / steps
    const mt = 1 - t
    const x = mt * mt * x0 + 2 * mt * t * cx + t * t * x1
    const y = mt * mt * y0 + 2 * mt * t * cy + t * t * y1
    const angle = Math.atan2(y - prevY, x - prevX)
    brushDab(ctx, x, y, angle, size * (0.7 + Math.sin(t * Math.PI) * 0.5), hue)
    prevX = x
    prevY = y
  }
}

function paintPaper(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.globalCompositeOperation = 'source-over'
  ctx.fillStyle = '#efe6d4'
  ctx.fillRect(0, 0, width, height)

  const canvas = ctx.canvas
  const img = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = img.data
  for (let i = 0; i < data.length; i += 4) {
    const n = (Math.random() - 0.5) * 22
    data[i] += n
    data[i + 1] += n
    data[i + 2] += n
  }
  ctx.putImageData(img, 0, 0)

  for (let i = 0; i < 220; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    const len = 3 + Math.random() * 10
    const a = Math.random() * Math.PI
    ctx.strokeStyle = `rgba(120, 105, 80, ${0.03 + Math.random() * 0.05})`
    ctx.lineWidth = 0.7
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len)
    ctx.stroke()
  }

  for (let i = 0; i < 3; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    const r = 60 + Math.random() * 120
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r)
    grad.addColorStop(0, 'rgba(150, 130, 95, 0.07)')
    grad.addColorStop(1, 'rgba(150, 130, 95, 0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, width, height)
  }

  const vignette = ctx.createRadialGradient(
    width / 2,
    height / 2,
    Math.min(width, height) * 0.4,
    width / 2,
    height / 2,
    Math.max(width, height) * 0.75,
  )
  vignette.addColorStop(0, 'rgba(60, 45, 25, 0)')
  vignette.addColorStop(1, 'rgba(60, 45, 25, 0.22)')
  ctx.fillStyle = vignette
  ctx.fillRect(0, 0, width, height)
}

export function PaintStrokes() {
  const prev = useRef<{ x: number; y: number; has: boolean }>({ x: 0, y: 0, has: false })
  const hue = useRef(210)
  const width = useRef(0)

  const frame = ({ ctx, pointer }: CanvasFrame) => {
    if (!pointer.active) {
      prev.current.has = false
      return
    }

    const p = prev.current
    if (!p.has) {
      p.x = pointer.x
      p.y = pointer.y
      p.has = true
      return
    }

    const dx = pointer.x - p.x
    const dy = pointer.y - p.y
    const dist = Math.hypot(dx, dy)
    if (dist < 0.5) return

    const angle = Math.atan2(dy, dx)

    const speed = Math.min(1, dist / 26)
    width.current += (speed - width.current) * 0.35
    const load = 1 - width.current * 0.62

    const size = Math.max(9, 32 * load)
    const spacing = Math.max(1.5, size * 0.18)
    const steps = Math.max(1, Math.floor(dist / spacing))

    ctx.globalCompositeOperation = 'multiply'
    ctx.globalAlpha = 0.45 + load * 0.55
    for (let i = 1; i <= steps; i++) {
      const t = i / steps
      hue.current = (hue.current + 0.25) % 360
      brushDab(ctx, p.x + dx * t, p.y + dy * t, angle, size, hue.current)
    }
    ctx.globalAlpha = 1
    ctx.globalCompositeOperation = 'source-over'

    p.x = pointer.x
    p.y = pointer.y
  }

  const canvasRef = useAnimatedCanvas(frame, {
    onResize: ({ width, height, ctx }) => {
      paintPaper(ctx, width, height)
      ctx.globalCompositeOperation = 'multiply'
      brushCurve(
        ctx,
        width * 0.14,
        height * 0.7,
        width * 0.4,
        height * 0.2,
        width * 0.62,
        height * 0.5,
        30,
        200,
      )
      brushCurve(
        ctx,
        width * 0.5,
        height * 0.78,
        width * 0.7,
        height * 0.45,
        width * 0.9,
        height * 0.28,
        26,
        28,
      )
      brushCurve(
        ctx,
        width * 0.28,
        height * 0.34,
        width * 0.45,
        height * 0.62,
        width * 0.74,
        height * 0.74,
        22,
        330,
      )
      ctx.globalCompositeOperation = 'source-over'
    },
  })

  return <canvas ref={canvasRef} className="size-full" />
}
