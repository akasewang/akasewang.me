import type { ComponentProps } from 'react'
import { cn } from '@/utils/utils'

/**
 * A decorative separator component that renders a tiny, faint bullet.
 * Primarily used to visually divide inline metadata items (e.g., date, views and read time).
 */
export function SeparatorBullet({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span className={cn('mx-1.5 flex shrink-0 items-center justify-center', className)} {...props}>
      <span className="size-0.5 rounded-full bg-muted-foreground/50" />
    </span>
  )
}
