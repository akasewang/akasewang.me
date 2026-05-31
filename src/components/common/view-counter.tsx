'use client'

import { useEffect, useRef } from 'react'
import { useViews } from '@/components/providers/views-context'
import { viewsContent } from '@/data/content/views-content'
import { Icons } from '@/components/ui/icons'

type ViewCounterProps = {
  slug?: string
  readOnly?: boolean
  type?: 'views' | 'visitors'
}

/**
 * A component that displays and optionally increments the view count for a specific slug.
 * Connects to the global `ViewsContext` to manage the request state and prevent duplicate tracking.
 *
 * @param slug - The unique identifier for the content being tracked.
 * @param readOnly - If true, the component will only fetch the view count without incrementing it.
 * @param type - Determines whether to track generic page 'views' or aggregate 'visitors'.
 */
export function ViewCounter({ slug, readOnly = false, type = 'views' }: ViewCounterProps) {
  const { getViews, requestView, incrementViews } = useViews()

  const effectiveSlug = type === 'visitors' ? '_site_visitors' : (slug ?? '')
  const count = getViews(effectiveSlug)

  /**
   * A persistent ref is used to track exactly which slug was processed during the current mount cycle.
   * This guarantees that React StrictMode's double-invocation in development will NEVER artificially
   * inflate database metrics by double-counting views.
   */
  const processedSlug = useRef<string | null>(null)

  useEffect(() => {
    if (!effectiveSlug || processedSlug.current === effectiveSlug) return

    if (readOnly) {
      /** Trigger a non-mutating database fetch via the global ViewsContext */
      requestView(effectiveSlug)
    } else {
      /** Fire-and-forget a database increment while optimistically updating the UI */
      incrementViews(effectiveSlug)
    }

    processedSlug.current = effectiveSlug
  }, [effectiveSlug, readOnly, requestView, incrementViews])

  if (count === undefined) {
    return <span className="animate-pulse">...</span>
  }

  if (count === null) {
    return (
      <span
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
        title={viewsContent.title}
      >
        <Icons.wifiOff className="size-3.5" />
        <span>{viewsContent.offline}</span>
      </span>
    )
  }

  if (type === 'visitors') {
    return (
      <span className="inline-flex items-center gap-1.5">
        <Icons.users className="size-3.5" />
        <span>
          {count.toLocaleString()} {viewsContent.visitors}
        </span>
      </span>
    )
  }

  return (
    <span>
      {count.toLocaleString()} {viewsContent.views}
    </span>
  )
}
