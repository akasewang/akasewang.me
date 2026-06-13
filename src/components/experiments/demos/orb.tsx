'use client'

import type { CSSProperties, PointerEvent } from 'react'
import { useEffect, useRef } from 'react'

/** Custom properties the orb reads for its highlight position. */
type OrbStyle = CSSProperties & { '--px': string; '--py': string }

const REST = { x: 0.5, y: 0.38 }

/**
 * Glossy 3D orb you can polish with the cursor. The specular highlight tracks the pointer through
 * CSS custom properties so the sphere reads as wet glass, the whole body tilts toward the cursor and
 * a conic sheen rotates endlessly across its surface. The highlight is eased toward its target every
 * frame, so it glides after the cursor and drifts smoothly back to rest on leave instead of snapping.
 * Values are written straight to the DOM so dragging the light never triggers a React render.
 */
export function Orb() {
  const ref = useRef<HTMLDivElement | null>(null)
  const target = useRef({ ...REST })
  const current = useRef({ ...REST })
  /** Starts the easing loop on demand; replaced by the effect while mounted. */
  const wake = useRef(() => {})

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    target.current.x = (e.clientX - rect.left) / rect.width
    target.current.y = (e.clientY - rect.top) / rect.height
    wake.current()
  }

  const onLeave = () => {
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
      /** Settle and idle the loop once the highlight reaches its target. */
      if (Math.abs(dx) < 0.0004 && Math.abs(dy) < 0.0004) {
        c.x = t.x
        c.y = t.y
        el.style.setProperty('--px', c.x.toFixed(4))
        el.style.setProperty('--py', c.y.toFixed(4))
        running = false
        return
      }
      c.x += dx * 0.12
      c.y += dy * 0.12
      el.style.setProperty('--px', c.x.toFixed(4))
      el.style.setProperty('--py', c.y.toFixed(4))
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
      style={{ '--px': '0.5', '--py': '0.38' } as OrbStyle}
      className="relative flex size-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_120%,#191634,#06060e)]"
    >
      <div
        className="relative aspect-square w-[62%] rounded-full"
        style={{
          background:
            'radial-gradient(circle at calc(var(--px) * 100%) calc(var(--py) * 100%), #ffffff, #c4b5fd 16%, #7c3aed 44%, #2e1065 72%, #110626 100%)',
          boxShadow: '0 0 60px -8px rgba(124, 58, 237, 0.7), inset 0 0 42px rgba(0, 0, 0, 0.5)',
          transform: 'translate(calc((var(--px) - 0.5) * 16px), calc((var(--py) - 0.5) * 16px))',
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
