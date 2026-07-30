'use client'

import { useRef } from 'react'
import { useAnimatedCanvas } from '@/hooks/use-animated-canvas'
import { followPointer } from '@/utils/pointer'

const LINES = 34

const HUES = Array.from({ length: LINES }, (_, i) => 196 + (i / (LINES - 1)) * 132)

const VAR_X = 2 * 92 * 92
const VAR_Y = 2 * 70 * 70

export function WaveLines() {
  const mouse = useRef({ x: 0, y: 0, strength: 0, swell: 0, primed: false })

  const canvasRef = useAnimatedCanvas(({ ctx, width, height, time, pointer }) => {
    const m = mouse.current
    if (pointer.active) {
      followPointer(m, pointer, 0.15)
    }

    m.strength += ((pointer.active ? 1 : 0) - m.strength) * 0.08
    if (!pointer.active && m.strength < 0.01) m.primed = false

    const speed = pointer.active ? Math.min(2.4, Math.hypot(pointer.vx, pointer.vy) * 0.09) : 0
    m.swell += (speed - m.swell) * (speed > m.swell ? 0.3 : 0.045)

    ctx.clearRect(0, 0, width, height)
    ctx.globalCompositeOperation = 'lighter'

    const segments = Math.max(2, Math.ceil(width / 6))
    const step = width / segments
    const dent = m.strength > 0.001
    const t1 = time * 1.2
    const t2 = time * 0.8
    const t3 = time * 0.45

    for (let i = 0; i < LINES; i++) {
      const depth = i / (LINES - 1)
      const baseY = depth * height
      const dentY = dent
        ? Math.exp(-((baseY - m.y) ** 2) / VAR_Y) * (66 + m.swell * 52) * m.strength
        : 0

      const phaseA = t1 + i * 0.35
      const phaseB = i * 0.2 - t2
      const phaseC = i * 0.11 + t3
      const swell = 0.55 + depth * 0.9

      ctx.beginPath()
      for (let seg = 0; seg <= segments; seg++) {
        const x = seg * step
        let y =
          baseY +
          Math.sin(x * 0.012 + phaseA) * 8 * swell +
          Math.sin(x * 0.02 + phaseB) * 5 * swell +
          Math.sin(x * 0.006 + phaseC) * 4 * swell

        if (dentY > 0.3) {
          const dx = x - m.x
          y -= Math.exp(-(dx * dx) / VAR_X) * dentY
        }

        if (seg === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }

      const lift = dentY / 90
      ctx.lineWidth = 0.7 + depth * 1.5 + lift * 0.9
      ctx.strokeStyle = `hsla(${HUES[i]}, 88%, ${62 + depth * 12 + lift * 18}%, ${Math.min(1, 0.26 + depth * 0.4 + lift * 0.35)})`
      ctx.stroke()
    }

    ctx.globalCompositeOperation = 'source-over'
  })

  return <canvas ref={canvasRef} className="size-full bg-[#080910]" />
}
