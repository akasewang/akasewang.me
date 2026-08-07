'use client'

import { useEffect, useRef } from 'react'
import { useViews } from '@/components/providers/views-context'
import { Icons } from '@/components/ui/icons'
import { Skeleton } from '@/components/ui/skeleton'
import { viewsContent } from '@/data/content/views-content'
import { visitKey } from '@/hooks/use-visits'

type CounterType = 'views' | 'sessions' | 'visits'

type ViewCounterProps = {
  slug?: string
  readOnly?: boolean
  type?: CounterType
}

function counterKey(type: CounterType, slug?: string) {
  if (type === 'sessions') return '_sessions'
  if (!slug) return ''
  return type === 'visits' ? visitKey(slug) : slug
}

/**
 * The view count for a page.
 *
 * Read only where a count is merely being shown, such as in a list. Otherwise it also counts the
 * visit, which the store keeps to once per session.
 */
export function ViewCounter({ slug, readOnly = false, type = 'views' }: ViewCounterProps) {
  const { getViews, requestView, incrementViews } = useViews()

  const effectiveSlug = counterKey(type, slug)
  const count = getViews(effectiveSlug)

  const processedSlug = useRef<string | null>(null)

  useEffect(() => {
    if (!effectiveSlug || processedSlug.current === effectiveSlug) return

    if (readOnly) {
      requestView(effectiveSlug)
    } else {
      incrementViews(effectiveSlug)
    }

    processedSlug.current = effectiveSlug
  }, [effectiveSlug, readOnly, requestView, incrementViews])

  if (count === undefined) {
    return <Skeleton className="inline-block h-3.5 w-10 align-middle opacity-60" />
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

  if (type === 'sessions') {
    return (
      <span className="inline-flex items-center gap-1.5">
        <Icons.eye className="size-3.5" />
        <span>
          {count.toLocaleString()} {viewsContent.sessions}
        </span>
      </span>
    )
  }

  return (
    <span>
      {count.toLocaleString()} {type === 'visits' ? viewsContent.visits : viewsContent.views}
    </span>
  )
}
