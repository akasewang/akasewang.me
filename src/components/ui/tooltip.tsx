'use client'

import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip'
import type { ReactNode } from 'react'
import { cn } from '@/utils/utils'
import { Kbd, KbdGroup } from './kbd'

/** Wraps the app so tooltips share one delay, the second opening at once after the first */
export function TooltipProvider({ delay = 0, ...props }: TooltipPrimitive.Provider.Props) {
  return <TooltipPrimitive.Provider data-slot="tooltip-provider" delay={delay} {...props} />
}

/** One tooltip: the root holds its open state, the trigger is whatever it describes */
export function Tooltip(props: TooltipPrimitive.Root.Props) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />
}

export function TooltipTrigger(props: TooltipPrimitive.Trigger.Props) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

type TooltipContentProps = TooltipPrimitive.Popup.Props &
  Pick<TooltipPrimitive.Positioner.Props, 'align' | 'alignOffset' | 'side' | 'sideOffset'> & {
    shortcut?: ReactNode | string[]
  }

/** One triangle, turned to face whichever side the tooltip ended up on */
const ARROW_CLASS = cn(
  'border-0 fill-primary stroke-none',
  'data-[side=bottom]:top-[-5px]',
  'data-[side=top]:bottom-[-5px] data-[side=top]:rotate-180',
  'data-[side=left]:right-[-7.5px] data-[side=left]:rotate-90',
  'data-[side=right]:left-[-7.5px] data-[side=right]:-rotate-90',
)

/** The tooltip itself, optionally showing the keyboard shortcut for whatever it describes */
export function TooltipContent({
  align = 'center',
  alignOffset,
  className,
  side = 'top',
  sideOffset = 6,
  children,
  shortcut,
  ...props
}: TooltipContentProps) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={cn(
            'tooltip-elegant relative flex items-center gap-1.5 rounded-md border-0 bg-primary px-2 py-1 font-mono text-[11px] leading-tight text-primary-foreground shadow-lg ring-0 [word-spacing:-0.05em]',
            className,
          )}
          {...props}
        >
          {children}
          {shortcut && (
            <KbdGroup>
              {Array.isArray(shortcut) ? (
                shortcut.map((key) => <Kbd key={key}>{key}</Kbd>)
              ) : (
                <Kbd>{shortcut}</Kbd>
              )}
            </KbdGroup>
          )}
          <TooltipPrimitive.Arrow
            data-slot="tooltip-arrow"
            className={ARROW_CLASS}
            render={
              <svg width="10" height="5" viewBox="0 0 10 5" aria-hidden="true">
                <polygon points="5,0 10,5 0,5" />
              </svg>
            }
          />
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  )
}
