'use client'

import { useCallback, useState } from 'react'

/**
 * Tracks whether a media file named in frontmatter actually loaded.
 *
 * Whether a project has artwork and whether that artwork resolves are two different questions, and
 * only the first can be answered while rendering. A path can be set and still be wrong: renamed,
 * moved between public folders, or never committed. Checking the field alone leaves that case
 * showing a broken frame, which looks like a bug in the page rather than a gap in the content, so
 * the surfaces that show media ask this as well and fall back on a failure the same way they fall
 * back on an absence.
 */
export function useMediaFallback(src?: string) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(src)

  /**
   * Clears the flag when the source changes, so a component reused for a different project by list
   * reordering does not inherit the previous one's failure. Adjusted while rendering rather than in
   * an effect: the new source has not been attempted yet, so reporting it as failed even for the
   * one render an effect would take to correct is reporting something untrue.
   */
  if (src !== loaded) {
    setLoaded(src)
    setFailed(false)
  }

  /**
   * Catches what onError cannot. An image that is server rendered can finish failing before React
   * has hydrated, and the error event it fired is long gone by the time a handler is attached, so
   * the element is asked directly on mount instead: an image reporting itself complete while having
   * no intrinsic width is one that finished loading and came back with nothing.
   */
  const ref = useCallback((node: HTMLImageElement | null) => {
    if (node?.complete && node.naturalWidth === 0) setFailed(true)
  }, [])

  return { failed, ref, onError: () => setFailed(true) }
}
