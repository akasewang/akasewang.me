import { useEffect, useRef, useState } from 'react'

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

    let animationFrameId: number
    let lastX = 0
    let lastY = 0
    let lastTime = 0

    const handleMouseMove = (e: MouseEvent, phase: SpotlightMoveState['phase'] = 'move') => {
      cancelAnimationFrame(animationFrameId)

      animationFrameId = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const now = performance.now()

        let intensity = 0.4

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

    const handleMouseEnter = (e: MouseEvent) => {
      lastTime = 0
      setIsHovering(true)
      handleMouseMove(e, 'enter')
    }

    const handleMouseLeave = () => {
      setIsHovering(false)
      lastTime = 0
      cancelAnimationFrame(animationFrameId)
    }

    el.addEventListener('mousemove', handleMouseMove)
    el.addEventListener('mouseenter', handleMouseEnter)
    el.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      el.removeEventListener('mousemove', handleMouseMove)
      el.removeEventListener('mouseenter', handleMouseEnter)
      el.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return { ref, isHovering }
}
