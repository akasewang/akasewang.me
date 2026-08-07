import { useEffect, useRef } from 'react'
import { usePageArriving } from './use-page-arrival'

/**
 * Returns a ref for a sentinel element and calls back when it comes into view. The margin means
 * the next page starts loading before the visitor reaches the end.
 */
export function useInfiniteScroll<T extends HTMLElement>(
  onIntersect: () => void,
  enabled: boolean = true,
  rootMargin: string = '400px',
) {
  const targetRef = useRef<T>(null)
  /**
   * A sliding page sweeps the sentinel across the viewport, and with a 400px margin ahead of it that
   * reads as reaching the end. Waiting the slide out keeps a navigation from silently paging in.
   */
  const isArriving = usePageArriving()

  /** Held in a ref so a new callback each render does not tear down and rebuild the observer */
  const onIntersectRef = useRef(onIntersect)

  useEffect(() => {
    onIntersectRef.current = onIntersect
  }, [onIntersect])

  useEffect(() => {
    const target = targetRef.current
    if (!enabled || isArriving || !target) return

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
  }, [enabled, isArriving, rootMargin])

  return targetRef
}
