import type { ComponentProps } from 'react'
import { cn } from '@/utils/utils'

/** The slash between parts of a path or a breadcrumb */
export function SeparatorSlash({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span className={cn('mx-1.5 shrink-0 text-muted-foreground/50', className)} {...props}>
      /
    </span>
  )
}
