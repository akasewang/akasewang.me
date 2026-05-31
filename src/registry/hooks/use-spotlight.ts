import { useRef, useState, useEffect } from 'react'

/**
 * Calculates an ease-out cubic intensity curve based on mouse movement speed.
 *
 * @returns {object} ref - Attach this to the container element.
 * @returns {boolean} isHovering - Whether the cursor is currently inside the container.
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
