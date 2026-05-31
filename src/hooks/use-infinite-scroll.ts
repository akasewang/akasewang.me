import { useEffect, useRef } from 'react'

/**
 * Custom React hook implementing `IntersectionObserver` for infinite scrolling pagination logic.
 *
 * @param onIntersect - Callback function executed when the target element enters the viewport.
 * @param enabled - Boolean to enable or disable the observer. Defaults to `true`.
 * @param rootMargin - The intersection observer's root margin. Defaults to `'400px'` to pre-fetch before the element becomes visible.
 * @returns {React.RefObject<T>} targetRef - Attach this ref to the DOM element acting as the infinite scroll trigger.
 */
export function useInfiniteScroll<T extends HTMLElement>(
  onIntersect: () => void,
  enabled: boolean = true,
  rootMargin: string = '400px',
) {
  const targetRef = useRef<T>(null)
  /**
   * A persistent ref to store the latest `onIntersect` callback.
   * This is a crucial React pattern: it guarantees the IntersectionObserver always
   * calls the most recent closure version of the callback without needing to be
   * re-instantiated every time the callback's dependencies change.
   */
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
