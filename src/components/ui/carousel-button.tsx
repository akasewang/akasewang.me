'use client'

import Link from 'next/link'
import { Icons } from '@/components/ui/icons'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/utils/utils'

interface CarouselButtonProps {
  href: string
  label: string
  shortcut?: string
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left'
  className?: string
}

/**
 * Wrapped in a Tooltip to provide accessible context to the user.
 *
 * @param href - The destination URL for the link.
 * @param label - The accessible label and tooltip text.
 * @param shortcut - An optional keyboard shortcut to display in the tooltip.
 * @param tooltipSide - Where the tooltip should appear relative to the button.
 */
export function CarouselButton({
  href,
  label,
  shortcut,
  tooltipSide = 'top',
  className,
}: CarouselButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          aria-label={label}
          className={cn(
            'absolute -inset-y-1 -right-2 z-10 flex w-8 items-center justify-center rounded-lg ring-1 ring-ring retina:ring-[0.5px] bg-card text-muted-foreground shadow-l-lg transition-[color,transform,scale,box-shadow] duration-300 ease-out hover:text-primary active:scale-[0.98] active:duration-200',
            className,
          )}
        >
          <Icons.dataTable className="size-5" />
        </Link>
      </TooltipTrigger>
      <TooltipContent side={tooltipSide} shortcut={shortcut}>
        {label}
      </TooltipContent>
    </Tooltip>
  )
}
