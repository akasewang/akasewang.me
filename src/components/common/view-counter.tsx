'use client'

import { useEffect, useRef } from 'react'
import { useViews } from '@/components/providers/views-context'
import { Icons } from '@/components/ui/icons'
import { viewsContent } from '@/data/content/views-content'

type ViewCounterProps = {
  slug?: string
  readOnly?: boolean
  type?: 'views' | 'sessions'
}

export function ViewCounter({ slug, readOnly = false, type = 'views' }: ViewCounterProps) {
  const { getViews, requestView, incrementViews } = useViews()

  const effectiveSlug = type === 'sessions' ? '_sessions' : (slug ?? '')
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
      {count.toLocaleString()} {viewsContent.views}
    </span>
  )
}
