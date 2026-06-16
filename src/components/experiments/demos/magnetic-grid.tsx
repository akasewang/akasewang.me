'use client'

import { useRef } from 'react'
import { useAnimatedCanvas } from '@/hooks/use-animated-canvas'

const GAP = 17
const TAU = Math.PI * 2

const IDLE_FILL = 'rgb(166, 176, 224)'

export function MagneticGrid() {
  const strength = useRef(0)

  const mouse = useRef({ x: 0, y: 0, primed: false })

  const canvasRef = useAnimatedCanvas(({ ctx, width, height, time, pointer }) => {
    ctx.clearRect(0, 0, width, height)

    strength.current +=
      ((pointer.active ? 1 : 0) - strength.current) * (pointer.active ? 0.2 : 0.06)
    const s = strength.current

    const m = mouse.current
    if (pointer.active) {
      if (!m.primed) {
        m.x = pointer.x
        m.y = pointer.y
        m.primed = true
      }
      m.x += (pointer.x - m.x) * 0.22
      m.y += (pointer.y - m.y) * 0.22
    } else if (s < 0.01) {
      m.primed = false
    }

    const interacting = s > 0.001
    const mx = m.x
    const my = m.y
    const radius = Math.min(width, height) * 0.6
    const invRadius = 1 / radius

    const hue = 212

    for (let y = GAP / 2; y < height; y += GAP) {
      for (let x = GAP / 2; x < width; x += GAP) {
        let dx = 0
        let dy = 0
        let prox = 0

        if (interacting) {
          const ox = x - mx
          const oy = y - my
          const d2 = ox * ox + oy * oy
          if (d2 < radius * radius) {
            const d = Math.sqrt(d2) || 1
            const f = 1 - d * invRadius

            prox = f * f * s
            const push = prox * 16
            dx = (ox / d) * push
            dy = (oy / d) * push
          }
        }

        const breathe = Math.sin(time * 1.3 + x * 0.045 + y * 0.045) * 0.5 + 0.5
        const r = (0.85 + prox * 2.8) * (0.7 + breathe * 0.3)

        if (prox > 0.004) {
          ctx.globalAlpha = 1
          ctx.fillStyle = `hsla(${hue}, 95%, ${64 + prox * 28}%, ${Math.min(1, 0.3 + prox)})`
        } else {
          ctx.globalAlpha = 0.13 + breathe * 0.1
          ctx.fillStyle = IDLE_FILL
        }
        ctx.beginPath()
        ctx.arc(x + dx, y + dy, r, 0, TAU)
        ctx.fill()
      }
    }
    ctx.globalAlpha = 1
  })

  return <canvas ref={canvasRef} className="size-full bg-[#080912]" />
}
