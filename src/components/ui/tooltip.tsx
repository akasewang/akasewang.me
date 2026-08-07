'use client'

import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip'
import {
  type ComponentProps,
  type ComponentPropsWithoutRef,
  forwardRef,
  isValidElement,
  type ReactNode,
} from 'react'
import { cn } from '@/utils/utils'
import { Kbd } from './kbd'

type TooltipProviderProps = ComponentProps<typeof TooltipPrimitive.Provider> & {
  delayDuration?: number
}

/** Wraps the app so tooltips share one delay, the second opening at once after the first */
export const TooltipProvider = ({ delayDuration = 0, delay, ...props }: TooltipProviderProps) => (
  <TooltipPrimitive.Provider delay={delay ?? delayDuration} {...props} />
)

export const Tooltip = TooltipPrimitive.Root

type TooltipTriggerProps = Omit<
  ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>,
  'ref' | 'render'
> & {
  asChild?: boolean
}

export const TooltipTrigger = forwardRef<HTMLButtonElement, TooltipTriggerProps>(
  ({ asChild, children, onFocus, ...props }, ref) => (
    <TooltipPrimitive.Trigger
      ref={ref}
      {...props}
      render={asChild && isValidElement(children) ? children : undefined}
      onFocus={(event) => {
        onFocus?.(event)
        if (!event.currentTarget.matches(':focus-visible')) event.preventDefault()
      }}
    >
      {asChild ? undefined : children}
    </TooltipPrimitive.Trigger>
  ),
)
TooltipTrigger.displayName = 'TooltipTrigger'

type TooltipPositionerProps = ComponentPropsWithoutRef<typeof TooltipPrimitive.Positioner>

type TooltipContentProps = ComponentPropsWithoutRef<typeof TooltipPrimitive.Popup> &
  Pick<TooltipPositionerProps, 'align' | 'alignOffset' | 'side' | 'sideOffset'> & {
    shortcut?: ReactNode | string[]
  }

const ARROW_CLASS = cn(
  'fill-primary',
  'data-[side=bottom]:top-[-5px]',
  'data-[side=top]:bottom-[-5px] data-[side=top]:rotate-180',
  'data-[side=left]:right-[-7.5px] data-[side=left]:rotate-90',
  'data-[side=right]:left-[-7.5px] data-[side=right]:-rotate-90',
)

/** The tooltip itself, optionally showing the keyboard shortcut for whatever it describes */
export const TooltipContent = forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ align, alignOffset, className, side, sideOffset = 6, children, shortcut, ...props }, ref) => (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <TooltipPrimitive.Popup
          ref={ref}
          className={cn(
            'tooltip-elegant relative z-50 flex items-center gap-1.5 rounded-md bg-primary px-2 py-1 font-mono text-[11px] leading-tight text-primary-foreground shadow-lg [word-spacing:-0.05em]',
            className,
          )}
          {...props}
        >
          {children}
          {shortcut && (
            <div className="flex items-center gap-0.5">
              {Array.isArray(shortcut) ? (
                shortcut.map((key) => <Kbd key={key}>{key}</Kbd>)
              ) : (
                <Kbd>{shortcut}</Kbd>
              )}
            </div>
          )}
          <TooltipPrimitive.Arrow
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
  ),
)
TooltipContent.displayName = 'TooltipContent'
