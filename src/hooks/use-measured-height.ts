import { type DependencyList, useEffect, useLayoutEffect, useRef, useState } from 'react'

/** Layout effects warn during server rendering, where there is nothing to measure anyway */
const useIsomorphicLayoutEffect = typeof document === 'undefined' ? useEffect : useLayoutEffect

/**
 * Tracks an element's rendered height for animating to an explicit value, starting at auto until
 * the first measurement lands. A ResizeObserver keeps it current when the content reflows.
 */
export function useMeasuredHeight<T extends HTMLElement>(deps: DependencyList) {
  const ref = useRef<T | null>(null)
  const [height, setHeight] = useState<number | 'auto'>('auto')

  useIsomorphicLayoutEffect(() => {
    const node = ref.current
    if (!node) return

    const measure = () => {
      const next = node.offsetHeight
      /** A hidden or unmounted node measures zero, which would collapse the animation target */
      if (next > 0) setHeight(next)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, deps)

  return [ref, height] as const
}
