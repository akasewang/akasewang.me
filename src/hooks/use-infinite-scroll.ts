import { useEffect, useRef } from 'react'

export function useInfiniteScroll<T extends HTMLElement>(
  onIntersect: () => void,
  enabled: boolean = true,
  rootMargin: string = '400px',
) {
  const targetRef = useRef<T>(null)

  const onIntersectRef = useRef(onIntersect)

  useEffect(() => {
    onIntersectRef.current = onIntersect
  }, [onIntersect])

  useEffect(() => {
    const target = targetRef.current
    if (!enabled || !target) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onIntersectRef.current()
        }
      },
      { threshold: 0.1, rootMargin },
    )

    observer.observe(target)

    return () => observer.disconnect()
  }, [enabled, rootMargin])

  return targetRef
}
