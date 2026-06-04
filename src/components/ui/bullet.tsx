import type { ComponentProps } from 'react'
import { cn } from '@/utils/utils'

/** A small dot used as an inline separator or list marker. */
export function Bullet({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('mx-0.5 size-1 shrink-0 rounded-full bg-muted-foreground', className)}
      {...props}
    />
  )
}
