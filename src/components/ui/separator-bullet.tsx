import type { ComponentProps } from 'react'
import { cn } from '@/utils/utils'

/** The dot between two pieces of metadata, such as a date and a reading time */
export function SeparatorBullet({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span className={cn('mx-1.5 flex shrink-0 items-center justify-center', className)} {...props}>
      <span className="size-0.5 rounded-full bg-muted-foreground/50" />
    </span>
  )
}
