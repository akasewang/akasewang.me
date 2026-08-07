import type { HTMLAttributes } from 'react'
import { cn } from '@/utils/utils'

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  shimmer?: boolean
}

/** A placeholder block that shimmers while the thing it stands for loads */
export function Skeleton({ className, shimmer = true, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('rounded-md bg-surface-30/70', shimmer && 'animate-shimmer', className)}
      {...props}
    />
  )
}
