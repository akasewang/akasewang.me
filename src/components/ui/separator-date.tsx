import type { ComponentProps } from 'react'
import { cn } from '@/utils/utils'

/**
 * A decorative separator component that renders a faint hyphen.
 * Primarily used to visually connect date ranges (e.g., "Jan 2020 - Present").
 */
export function SeparatorDate({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span className={cn('mx-1 shrink-0 text-muted-foreground/50', className)} {...props}>
      -
    </span>
  )
}
