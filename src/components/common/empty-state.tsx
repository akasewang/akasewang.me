'use client'

import type { ReactNode } from 'react'
import { cn } from '@/utils/utils'

interface EmptyStateProps {
  title?: string
  message: string
  children?: ReactNode
  className?: string
}

/** Shown where a filter matches nothing, so an empty list still says something */
export function EmptyState({ title, message, children, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center overflow-hidden rounded-3xl px-4 py-20 text-center select-none',
        className,
      )}
    >
      {title && (
        <h3 className="mb-2 text-balance font-serif text-lg font-medium italic tracking-tight text-foreground/90">
          {title}
        </h3>
      )}

      <p className="max-w-[320px] text-balance text-sm font-medium leading-relaxed text-muted-foreground/50">
        {message}
      </p>

      {children && (
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">{children}</div>
      )}
    </div>
  )
}
