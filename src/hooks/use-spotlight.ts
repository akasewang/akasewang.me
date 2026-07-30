import { useEffect, useRef, useState } from 'react'
import { canUseHoverPointer } from '@/utils/pointer'

export interface SpotlightMoveState {
  phase: 'enter' | 'move'
  intensity: number
  x: number
  y: number
  ratioX: number
  ratioY: number
}

interface UseSpotlightOptions {
  onMove?: (state: SpotlightMoveState) => void
}

/**
 * Tracks the pointer across an element and publishes its position as CSS custom properties, so the
 * glow itself is drawn in CSS and no React state changes per move. Intensity rises with pointer
 * speed, which makes a card brighten as it is swept across and settle once the pointer slows.
 */
export function useSpotlight<T extends HTMLElement = HTMLElement>({
  onMove,
}: UseSpotlightOptions = {}) {
  const ref = useRef<T>(null)
  const onMoveRef = useRef(onMove)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    onMoveRef.current = onMove
  }, [onMove])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let animationFrameId = 0
    let lastX = 0
    let lastY = 0
    let lastTime = 0

    const handlePointerMove = (e: PointerEvent, phase: SpotlightMoveState['phase'] = 'move') => {
      if (!canUseHoverPointer(e.pointerType)) return

      /** Only the newest position matters, so a queued frame is replaced rather than added to */
      cancelAnimationFrame(animationFrameId)

      animationFrameId = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const now = performance.now()

        let intensity = 0.4

        /** No previous sample on entry, so the first frame keeps the resting intensity */
        if (lastTime > 0) {
          const dx = e.clientX - lastX
          const dy = e.clientY - lastY
          const velocity = Math.sqrt(dx * dx + dy * dy) / Math.max(now - lastTime, 1)

          const raw = Math.min(velocity / 2.5, 1)
          intensity = 0.4 + 0.6 * (1 - (1 - raw) ** 3)
        }

        lastX = e.clientX
        lastY = e.clientY
        lastTime = now

        el.style.setProperty('--mx', `${x}px`)
        el.style.setProperty('--my', `${y}px`)
        el.style.setProperty('--spotlight-intensity', intensity.toString())
        onMoveRef.current?.({
          phase,
          intensity,
          x,
          y,
          ratioX: x / rect.width,
          ratioY: y / rect.height,
        })
      })
    }

    const handlePointerEnter = (e: PointerEvent) => {
      if (!canUseHoverPointer(e.pointerType)) return

      lastTime = 0
      setIsHovering(true)
      handlePointerMove(e, 'enter')
    }

    const handlePointerLeave = () => {
      setIsHovering(false)
      lastTime = 0
      cancelAnimationFrame(animationFrameId)
    }

    el.addEventListener('pointermove', handlePointerMove)
    el.addEventListener('pointerenter', handlePointerEnter)
    el.addEventListener('pointerleave', handlePointerLeave)

    return () => {
      el.removeEventListener('pointermove', handlePointerMove)
      el.removeEventListener('pointerenter', handlePointerEnter)
      el.removeEventListener('pointerleave', handlePointerLeave)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return { ref, isHovering }
}
