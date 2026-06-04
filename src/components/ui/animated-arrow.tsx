'use client'

import { Icons } from '@/components/ui/icons'
import { cn } from '@/utils/utils'

/** Props for {@link AnimatedArrow}. */
interface AnimatedArrowProps {
  className?: string
}

/**
 * An outward arrow that slides away and back in on hover/active. Expects a `group` parent.
 *
 * @param className - Optional CSS classes for custom sizing or positioning.
 */
export function AnimatedArrow({ className }: AnimatedArrowProps) {
  return (
    <span className={cn('relative inline-block size-4 overflow-hidden', className)}>
      <Icons.arrowOutward className="absolute inset-0 size-full transition-[opacity,transform,translate] duration-300 group-hover:-translate-y-full group-active:-translate-y-full group-hover:translate-x-full group-active:translate-x-full group-hover:opacity-0 group-active:opacity-0" />
      <Icons.arrowOutward className="absolute inset-0 size-full -translate-x-full translate-y-full opacity-0 transition-[opacity,transform,translate] duration-300 group-hover:translate-x-0 group-active:translate-x-0 group-hover:translate-y-0 group-active:translate-y-0 group-hover:opacity-100 group-active:opacity-100 group-hover:delay-75 group-active:delay-75" />
    </span>
  )
}
