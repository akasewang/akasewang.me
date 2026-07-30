'use client'

import type { CSSProperties, PointerEvent } from 'react'
import { useEffect, useRef } from 'react'

type OrbStyle = CSSProperties & { '--px': string; '--py': string; '--lit': string }

const REST = { x: 0.5, y: 0.38 }

export function Orb() {
  const ref = useRef<HTMLDivElement | null>(null)
  const target = useRef({ ...REST })
  const current = useRef({ ...REST })

  const vel = useRef({ x: 0, y: 0 })
  const lit = useRef(0)
  const held = useRef(false)
  const wake = useRef(() => {})

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    target.current.x = (e.clientX - rect.left) / rect.width
    target.current.y = (e.clientY - rect.top) / rect.height
    held.current = true
    wake.current()
  }

  const onLeave = () => {
    held.current = false
    target.current.x = REST.x
    target.current.y = REST.y
    wake.current()
  }

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    let running = false
    let visible = true

    const tick = () => {
      const c = current.current
      const t = target.current
      const dx = t.x - c.x
      const dy = t.y - c.y

      const settled =
        Math.abs(dx) < 0.0004 &&
        Math.abs(dy) < 0.0004 &&
        Math.abs(vel.current.x) < 0.0002 &&
        Math.abs(vel.current.y) < 0.0002 &&
        Math.abs(lit.current - (held.current ? 1 : 0)) < 0.004

      if (settled) {
        c.x = t.x
        c.y = t.y
        vel.current.x = 0
        vel.current.y = 0
        lit.current = held.current ? 1 : 0
        el.style.setProperty('--px', c.x.toFixed(4))
        el.style.setProperty('--py', c.y.toFixed(4))
        el.style.setProperty('--lit', lit.current.toFixed(4))
        running = false
        return
      }
      vel.current.x = (vel.current.x + dx * 0.09) * 0.82
      vel.current.y = (vel.current.y + dy * 0.09) * 0.82
      c.x += vel.current.x
      c.y += vel.current.y

      const focus = held.current ? 1 : 0
      lit.current += (focus - lit.current) * 0.08

      el.style.setProperty('--px', c.x.toFixed(4))
      el.style.setProperty('--py', c.y.toFixed(4))
      el.style.setProperty('--lit', lit.current.toFixed(4))
      raf = requestAnimationFrame(tick)
    }
    const start = () => {
      if (running || !visible || document.hidden) return
      running = true
      raf = requestAnimationFrame(tick)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }
    wake.current = start

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) start()
        else stop()
      },
      { threshold: 0 },
    )
    io.observe(el)
    const onVisibility = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', onVisibility)
    start()

    return () => {
      stop()
      wake.current = () => {}
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ '--px': '0.5', '--py': '0.38', '--lit': '0' } as OrbStyle}
      className="relative flex size-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_120%,#191634,#06060e)]"
    >
      <div
        className="relative aspect-square w-[62%] rounded-full"
        style={{
          background:
            'radial-gradient(circle at calc(var(--px) * 100%) calc(var(--py) * 100%), #ffffff, #c4b5fd calc(16% - var(--lit) * 5%), #7c3aed 44%, #2e1065 72%, #110626 100%)',
          boxShadow:
            '0 0 calc(60px + var(--lit) * 34px) -8px rgba(124, 58, 237, calc(0.7 + var(--lit) * 0.25)), inset 0 0 42px rgba(0, 0, 0, 0.5)',
          transform:
            'translate(calc((var(--px) - 0.5) * 22px), calc((var(--py) - 0.5) * 22px)) scale(calc(1 + var(--lit) * 0.035))',
        }}
      >
        <div
          className="absolute inset-0 rounded-full opacity-40 mix-blend-screen animate-[spin_7s_linear_infinite]"
          style={{
            background:
              'conic-gradient(from 0deg, transparent, rgba(255, 255, 255, 0.55), transparent 42%)',
          }}
        />
        <div
          className="absolute inset-0 rounded-full"
          style={{ boxShadow: 'inset 0 -18px 30px rgba(0, 0, 0, 0.55)' }}
        />
      </div>
    </div>
  )
}
