import type { ComponentProps } from 'react'
import { cn } from '@/utils/utils'

export function SeparatorDate({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span className={cn('mx-1 shrink-0 text-muted-foreground/50', className)} {...props}>
      -
    </span>
  )
}
