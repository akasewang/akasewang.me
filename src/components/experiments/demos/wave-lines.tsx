'use client'

import { useRef } from 'react'
import { useAnimatedCanvas } from '@/hooks/use-animated-canvas'

const LINES = 30

const STROKES = Array.from(
  { length: LINES },
  (_, i) => `hsla(${196 + (i / (LINES - 1)) * 130}, 82%, 66%, 0.5)`,
)

const VAR_X = 2 * 92 * 92
const VAR_Y = 2 * 70 * 70

export function WaveLines() {
  const mouse = useRef({ x: 0, y: 0, strength: 0, primed: false })

  const canvasRef = useAnimatedCanvas(({ ctx, width, height, time, pointer }) => {
    const m = mouse.current
    if (pointer.active) {
      if (!m.primed) {
        m.x = pointer.x
        m.y = pointer.y
        m.primed = true
      }
      m.x += (pointer.x - m.x) * 0.15
      m.y += (pointer.y - m.y) * 0.15
    }

    m.strength += ((pointer.active ? 1 : 0) - m.strength) * 0.08
    if (!pointer.active && m.strength < 0.01) m.primed = false

    ctx.clearRect(0, 0, width, height)
    ctx.globalCompositeOperation = 'lighter'
    ctx.lineWidth = 1.4

    const segments = Math.max(2, Math.ceil(width / 6))
    const step = width / segments
    const dent = m.strength > 0.001
    const t1 = time * 1.2
    const t2 = time * 0.8
    for (let i = 0; i < LINES; i++) {
      const baseY = (i / (LINES - 1)) * height
      const dentY = dent ? Math.exp(-((baseY - m.y) ** 2) / VAR_Y) * 64 * m.strength : 0

      const phaseA = t1 + i * 0.35
      const phaseB = i * 0.2 - t2

      ctx.beginPath()
      for (let seg = 0; seg <= segments; seg++) {
        const x = seg * step
        let y = baseY + Math.sin(x * 0.012 + phaseA) * 8 + Math.sin(x * 0.02 + phaseB) * 5

        if (dentY > 0.3) {
          const dx = x - m.x
          y -= Math.exp(-(dx * dx) / VAR_X) * dentY
        }

        if (seg === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }

      ctx.strokeStyle = STROKES[i]
      ctx.stroke()
    }

    ctx.globalCompositeOperation = 'source-over'
  })

  return <canvas ref={canvasRef} className="size-full bg-[#080910]" />
}
