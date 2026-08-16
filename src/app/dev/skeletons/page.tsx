import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SkeletonSwitcher } from './skeleton-switcher'

/**
 * A place to look at the loading skeletons, which otherwise flash past in a few milliseconds and
 * cannot be inspected at all.
 *
 * The switcher below holds which one is showing. All this route does is refuse to exist outside
 * development and hand over whichever skeleton the address asked for, so a link to one still opens
 * on it.
 */
export const metadata: Metadata = {
  title: 'Skeleton preview',
  robots: { index: false, follow: false },
}

export default async function SkeletonPreview({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>
}) {
  /** Reachable on the live site otherwise, an internal preview being no part of what is published */
  if (process.env.NODE_ENV === 'production') notFound()

  const { view } = await searchParams

  return <SkeletonSwitcher initialView={view} />
}
