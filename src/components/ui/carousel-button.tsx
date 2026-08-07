'use client'

import { Icons } from '@/components/ui/icons'
import { Link } from '@/components/ui/route-link'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import { cn } from '@/utils/utils'

interface CarouselButtonProps {
  href: string
  label: string
  shortcut?: string
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left'
  className?: string
}

/** The control that leads from a landing page carousel through to its fuller page */
export function CarouselButton({
  href,
  label,
  shortcut,
  tooltipSide = 'top',
  className,
}: CarouselButtonProps) {
  const { hoverLink, navigate: navigateSound } = useSoundEffects()

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          aria-label={label}
          onMouseEnter={hoverLink}
          onClick={navigateSound}
          className={cn(
            'absolute -inset-y-1 -right-2 z-10 flex w-8 items-center justify-center rounded-lg ring-1 ring-ring retina:ring-[0.5px] bg-card text-muted-foreground shadow-l-lg transition-[color,transform,scale,box-shadow] duration-300 ease-out supports-hover:hover:text-primary active:text-primary active:scale-[0.98] active:duration-200',
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
