'use client'

import { useRef } from 'react'
import { useAnimatedCanvas } from '@/hooks/use-animated-canvas'

const RAMP = '.,-~:;=!*#$@'
const CELL = 7
const ASPECT = 0.58
const THETA_STEP = 0.06
const PHI_STEP = 0.015
const R1 = 1
const R2 = 2
const K2 = 5.4
const SPAN = R1 + R2

const BANDS = [
  { ceiling: 2, light: 54, alpha: 0.3 },
  { ceiling: 5, light: 64, alpha: 0.6 },
  { ceiling: 8, light: 74, alpha: 0.85 },
  { ceiling: 11, light: 88, alpha: 1 },
]

export function AsciiTorus() {
  const spin = useRef({ a: 0.6, b: 0.3, va: 0.62, vb: 0.41 })

  const canvasRef = useAnimatedCanvas(({ ctx, width, height, dt, pointer }) => {
    ctx.font = `${CELL}px ui-monospace, SFMono-Regular, Menlo, monospace`

    const charWidth = ctx.measureText('M').width || CELL * ASPECT
    const cols = Math.max(16, Math.floor(width / charWidth))
    const rows = Math.max(10, Math.floor(height / CELL))
    const squash = charWidth / CELL
    const s = spin.current

    const targetVa = pointer.active ? -1.6 + (pointer.y / height) * 3.2 : 0.62
    const targetVb = pointer.active ? -1.6 + (pointer.x / width) * 3.2 : 0.41

    s.va += (targetVa - s.va) * 0.06
    s.vb += (targetVb - s.vb) * 0.06
    s.a += s.va * dt
    s.b += s.vb * dt

    const depth = new Float32Array(cols * rows)
    const glyph = new Int8Array(cols * rows).fill(-1)

    const sinA = Math.sin(s.a)
    const cosA = Math.cos(s.a)
    const sinB = Math.sin(s.b)
    const cosB = Math.cos(s.b)

    const reach = SPAN / K2
    const k1 = Math.min((cols * 0.44) / reach, (rows * 0.4) / (reach * squash))

    let nearest = 0
    let furthest = 1

    for (let theta = 0; theta < Math.PI * 2; theta += THETA_STEP) {
      const sinT = Math.sin(theta)
      const cosT = Math.cos(theta)
      const circleX = R2 + R1 * cosT
      const circleY = R1 * sinT

      for (let phi = 0; phi < Math.PI * 2; phi += PHI_STEP) {
        const sinP = Math.sin(phi)
        const cosP = Math.cos(phi)

        const x = circleX * (cosB * cosP + sinA * sinB * sinP) - circleY * cosA * sinB
        const y = circleX * (sinB * cosP - sinA * cosB * sinP) + circleY * cosA * cosB
        const z = K2 + cosA * circleX * sinP + circleY * sinA
        const ooz = 1 / z

        const px = (cols / 2 + k1 * ooz * x) | 0
        const py = (rows / 2 - k1 * squash * ooz * y) | 0

        if (px < 0 || px >= cols || py < 0 || py >= rows) continue

        const luminance =
          cosP * cosT * sinB -
          cosA * cosT * sinP -
          sinA * sinT +
          cosB * (cosA * sinT - cosT * sinA * sinP)

        if (luminance <= 0) continue

        const cell = py * cols + px
        if (ooz <= depth[cell]) continue

        depth[cell] = ooz
        glyph[cell] = Math.min(RAMP.length - 1, (luminance * 8) | 0)

        if (ooz > nearest) nearest = ooz
        if (ooz < furthest) furthest = ooz
      }
    }

    ctx.clearRect(0, 0, width, height)
    ctx.textBaseline = 'top'

    const offsetX = (width - cols * charWidth) / 2
    const offsetY = (height - rows * CELL) / 2
    const range = Math.max(0.0001, nearest - furthest)

    let floor = -1

    for (const band of BANDS) {
      for (let row = 0; row < rows; row++) {
        let line = ''
        let filled = false
        let depthSum = 0
        let depthCount = 0

        for (let col = 0; col < cols; col++) {
          const cell = row * cols + col
          const value = glyph[cell]

          if (value > floor && value <= band.ceiling) {
            line += RAMP[value]
            filled = true
            depthSum += depth[cell]
            depthCount++
          } else {
            line += ' '
          }
        }

        if (!filled) continue

        const near = (depthSum / depthCount - furthest) / range
        ctx.fillStyle = `hsla(${266 - near * 82}, 92%, ${band.light}%, ${band.alpha})`
        ctx.fillText(line, offsetX, offsetY + row * CELL)
      }

      floor = band.ceiling
    }
  })

  return <canvas ref={canvasRef} className="size-full bg-[#04050b]" />
}
