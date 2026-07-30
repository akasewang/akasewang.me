'use client'

import { useRef } from 'react'
import { useAnimatedCanvas } from '@/hooks/use-animated-canvas'
import { followPointer } from '@/utils/pointer'

const GAP = 17
const TAU = Math.PI * 2
const SPRING = 0.055
const DAMPING = 0.86
const PUSH = 190
const DRAG = 0.34

const IDLE_FILL = 'rgb(178, 188, 232)'

export function MagneticGrid() {
  const field = useRef({
    cols: 0,
    rows: 0,
    ox: new Float32Array(0),
    oy: new Float32Array(0),
    vx: new Float32Array(0),
    vy: new Float32Array(0),
  })
  const mouse = useRef({ x: 0, y: 0, primed: false })

  const canvasRef = useAnimatedCanvas(({ ctx, width, height, dt, time, pointer }) => {
    ctx.clearRect(0, 0, width, height)

    const cols = Math.max(1, Math.ceil(width / GAP))
    const rows = Math.max(1, Math.ceil(height / GAP))
    const f = field.current

    if (f.cols !== cols || f.rows !== rows) {
      const count = cols * rows
      field.current = {
        cols,
        rows,
        ox: new Float32Array(count),
        oy: new Float32Array(count),
        vx: new Float32Array(count),
        vy: new Float32Array(count),
      }
    }

    const { ox, oy, vx, vy } = field.current
    const m = mouse.current

    if (pointer.active) {
      followPointer(m, pointer, 0.3)
    } else {
      m.primed = false
    }

    const speed = Math.min(3.2, Math.hypot(pointer.vx, pointer.vy) * 0.08)
    const force = PUSH * (1 + speed)
    const radius = Math.min(width, height) * 0.6
    const radius2 = radius * radius
    const step = Math.min(dt, 1 / 40)

    for (let row = 0; row < rows; row++) {
      const baseY = GAP / 2 + row * GAP

      for (let col = 0; col < cols; col++) {
        const i = row * cols + col
        const baseX = GAP / 2 + col * GAP

        if (pointer.active) {
          const dx = baseX + ox[i] - m.x
          const dy = baseY + oy[i] - m.y
          const d2 = dx * dx + dy * dy

          if (d2 < radius2) {
            const d = Math.sqrt(d2) || 1
            const falloff = (1 - d / radius) ** 2
            const push = (falloff * force) / d

            vx[i] += dx * push * step + pointer.vx * falloff * DRAG
            vy[i] += dy * push * step + pointer.vy * falloff * DRAG
          }
        }

        vx[i] = (vx[i] - ox[i] * SPRING) * DAMPING
        vy[i] = (vy[i] - oy[i] * SPRING) * DAMPING
        ox[i] += vx[i] * step * 60
        oy[i] += vy[i] * step * 60

        const displaced = Math.min(1, Math.hypot(ox[i], oy[i]) / 22)
        const breathe = Math.sin(time * 1.3 + baseX * 0.045 + baseY * 0.045) * 0.5 + 0.5
        const r = (0.95 + displaced * 2.6) * (0.72 + breathe * 0.3)

        if (displaced > 0.02) {
          ctx.globalAlpha = 1
          ctx.fillStyle = `hsla(${212 - displaced * 30}, 95%, ${64 + displaced * 26}%, ${Math.min(1, 0.34 + displaced)})`
        } else {
          ctx.globalAlpha = 0.3 + breathe * 0.16
          ctx.fillStyle = IDLE_FILL
        }

        ctx.beginPath()
        ctx.arc(baseX + ox[i], baseY + oy[i], r, 0, TAU)
        ctx.fill()
      }
    }

    ctx.globalAlpha = 1
  })

  return <canvas ref={canvasRef} className="size-full bg-[#080912]" />
}
