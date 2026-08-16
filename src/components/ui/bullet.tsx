import type { ComponentProps } from 'react'
import { cn } from '@/utils/utils'

/** A filled dot used as a marker, as opposed to SeparatorBullet which sits between two things */
export function Bullet({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('mx-0.5 size-1 shrink-0 rounded-full bg-muted-foreground', className)}
      {...props}
    />
  )
}
