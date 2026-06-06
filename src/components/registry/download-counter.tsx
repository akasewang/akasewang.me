'use client'

import { useEffect, useRef } from 'react'
import { useViews } from '@/components/providers/views-context'
import { cn } from '@/utils/utils'

/** Props for {@link DownloadCounter}. */
interface DownloadCounterProps {
  slug: string
}

/**
 * Renders a digital clock style install counter.
 * Displayed as a centered horizontal block, typically used at the end of component documentation pages.
 * @param slug - The unique component identifier used to fetch install statistics.
 */
export function DownloadCounter({ slug }: DownloadCounterProps) {
  const { getInstalls, requestView } = useViews()
  const count = getInstalls(slug)

  const displayCount = (count ?? 0).toString().padStart(5, '0')

  const processedSlug = useRef<string | null>(null)

  useEffect(() => {
    if (!slug || processedSlug.current === slug) return

    requestView(slug)
    processedSlug.current = slug
  }, [slug, requestView])

  return (
    <div
      title="CLI Installs"
      className={cn(
        'not-prose mt-12 mb-6 flex w-full items-center justify-center gap-1.5',
        count === undefined && 'animate-pulse opacity-50',
      )}
    >
      {displayCount.split('').map((digit, i) => (
        <span
          key={i}
          className="flex h-10 w-8 items-center justify-center rounded-md bg-code-block font-mono text-lg font-medium tracking-tight text-foreground"
        >
          {digit}
        </span>
      ))}
    </div>
  )
}
