import type { ComponentProps } from 'react'
import { cn } from '@/utils/utils'

/** A small label for a technology or topic, as listed on a project or a post */
export function Tag({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      data-slot="tag"
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md ring-1 ring-inset ring-ring/80 bg-surface-50 px-1.5 py-0.5 font-mono text-[11px] text-secondary whitespace-nowrap retina:ring-[0.5px]',
        "[&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
        className,
      )}
      {...props}
    />
  )
}
