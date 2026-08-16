'use client'

import dynamic from 'next/dynamic'

/**
 * The background, loaded on the client only. It draws to a canvas sized from the window, so there
 * is nothing for the server to render and asking it to try would only cost a mismatch.
 */
export const SiteBackground = dynamic(
  () => import('./branching-background').then((mod) => mod.BranchingBackground),
  { ssr: false },
)
