import type React from 'react'
import { cn } from '@/utils/utils'

/** A compact, semantic keyboard key matching the shadcn Base UI treatment. */
export function Kbd({ className, ...props }: React.ComponentProps<'kbd'>) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        'pointer-events-none inline-flex h-4 w-fit min-w-4 select-none items-center justify-center gap-0.5 rounded-sm bg-muted px-1 font-sans text-4xs font-medium leading-none text-muted-foreground',
        "[&_svg:not([class*='size-'])]:size-2.5",
        '[[data-slot=tooltip-content]_&]:bg-background/20 [[data-slot=tooltip-content]_&]:text-background dark:[[data-slot=tooltip-content]_&]:bg-background/10',
        /**
         * A flat size, for the one surface drawn at its natural size.
         *
         * A tooltip holds itself apart from the interface scale by resetting the spacing and radius
         * its box is built from. Type is not among those, so `text-4xs` would go on following the
         * scale and grow inside a popup that had stopped. Pixels are what is wanted here precisely
         * because they answer to nothing.
         */
        '[[data-slot=tooltip-content]_&]:text-[9px]',
        className,
      )}
      {...props}
    />
  )
}

/** Keeps multi-key shortcuts aligned without drawing an extra container. */
export function KbdGroup({ className, ...props }: React.ComponentProps<'kbd'>) {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn('inline-flex items-center gap-0.5', className)}
      {...props}
    />
  )
}
