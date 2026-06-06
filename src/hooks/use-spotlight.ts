import { useRef, useState, useEffect } from 'react'

/**
 * Drives a velocity reactive spotlight effect. Tracks the cursor inside the container and
 * writes its position (`--mx`/`--my`) and an ease-out-cubic intensity (`--spotlight-intensity`)
 * as CSS custom properties, flaring brighter on faster movement and settling as it slows.
 * Updates are batched into `requestAnimationFrame` to avoid layout thrashing.
 *
 * @returns ref - Attach this to the container element being spotlit.
 * @returns isHovering - Whether the cursor is currently inside the container.
 */
export function useSpotlight<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let animationFrameId: number
    let lastX = 0
    let lastY = 0
    let lastTime = 0

    const handleMouseMove = (e: MouseEvent) => {
      /** Debounce layout thrashing by syncing DOM updates with the browser's native repaint cycle */
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
          /** Calculate raw cursor velocity (pixels per millisecond) */
          const velocity = Math.sqrt(dx * dx + dy * dy) / Math.max(now - lastTime, 1)

          /**
           * Clamp the velocity and apply an ease-out cubic curve.
           * This causes the spotlight intensity to flare up dramatically on fast mouse movements
           * Fades out smoothly as the mouse slows down.
           */
          const raw = Math.min(velocity / 2.5, 1)
          intensity = 0.4 + 0.6 * (1 - Math.pow(1 - raw, 3))
        }

        lastX = e.clientX
        lastY = e.clientY
        lastTime = now

        el.style.setProperty('--mx', `${x}px`)
        el.style.setProperty('--my', `${y}px`)
        el.style.setProperty('--spotlight-intensity', intensity.toString())
      })
    }

    const handleMouseEnter = (e: MouseEvent) => {
      lastTime = 0
      setIsHovering(true)
      handleMouseMove(e)
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
