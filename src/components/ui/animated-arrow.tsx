'use client'

import { Icons } from '@/components/ui/icons'
import { cn } from '@/utils/utils'

interface AnimatedArrowProps {
  className?: string
}

const ARROW_CLASS =
  'absolute inset-0 size-full transition-transform duration-200 ease-out motion-reduce:transition-none'

/** An arrow that leans in the direction of travel when its link is hovered */
export function AnimatedArrow({ className }: AnimatedArrowProps) {
  return (
    <span className={cn('relative inline-block size-4 overflow-hidden', className)}>
      <Icons.arrowOutward
        className={cn(
          ARROW_CLASS,
          'supports-hover:group-hover:-translate-y-full supports-hover:group-hover:translate-x-full group-active:-translate-y-full group-active:translate-x-full',
        )}
      />
      <Icons.arrowOutward
        className={cn(
          ARROW_CLASS,
          '-translate-x-full translate-y-full supports-hover:group-hover:translate-x-0 supports-hover:group-hover:translate-y-0 group-active:translate-x-0 group-active:translate-y-0',
        )}
      />
    </span>
  )
}
