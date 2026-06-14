import { type DependencyList, useEffect, useLayoutEffect, useRef, useState } from 'react'

/** Layout effect on the client, passive effect during SSR (avoids the useLayoutEffect SSR warning). */
const useIsomorphicLayoutEffect = typeof document === 'undefined' ? useEffect : useLayoutEffect

/**
 * Track a node's rendered height so a container can animate between sizes. Re-measures
 * synchronously whenever `deps` change and keeps watching for later shifts (images, fonts,
 * viewport resizes).
 *
 * The measurement runs in a layout effect so the previous observer is torn down before it can
 * report a stale height; otherwise the container freezes on the old size when the tracked node
 * is swapped rapidly, e.g. flicking between tabs.
 *
 * @param deps - Re-run the measurement when these change (typically the active key).
 * @returns A ref to attach to the measured node and its current height (`'auto'` until measured).
 */
export function useMeasuredHeight<T extends HTMLElement>(deps: DependencyList) {
  const ref = useRef<T | null>(null)
  const [height, setHeight] = useState<number | 'auto'>('auto')

  useIsomorphicLayoutEffect(() => {
    const node = ref.current
    if (!node) return
    /** Skip zero heights: a hidden, outgoing node would otherwise collapse the container. */
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
