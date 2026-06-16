import { type DependencyList, useEffect, useLayoutEffect, useRef, useState } from 'react'

const useIsomorphicLayoutEffect = typeof document === 'undefined' ? useEffect : useLayoutEffect

export function useMeasuredHeight<T extends HTMLElement>(deps: DependencyList) {
  const ref = useRef<T | null>(null)
  const [height, setHeight] = useState<number | 'auto'>('auto')

  useIsomorphicLayoutEffect(() => {
    const node = ref.current
    if (!node) return

    const measure = () => {
      const next = node.offsetHeight
      if (next > 0) setHeight(next)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, deps)

  return [ref, height] as const
}
