'use client'

import { type ReactNode } from 'react'
import { cn } from '@/utils/utils'

/** Props for {@link EmptyState}. */
interface EmptyStateProps {
  title?: string
  message: string
  children?: ReactNode
  className?: string
}

/**
 * A standard UI component used to display a visually appealing message when no data is available.
 * Note: This component is intentionally purely functional (no framer-motion) so that parent
 * components (like filtered lists) can cleanly handle `AnimatePresence` and `layout` shifts.
 *
 * @param title - Optional heading to display above the message.
 * @param message - The primary text explaining the empty state.
 * @param children - Optional interactive elements (like a "Clear filters" button) to render below the message.
 * @param className - Optional CSS classes for custom container styling.
 */
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
