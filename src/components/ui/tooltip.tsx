'use client'

import { Arrow, Content, Portal, Provider, Root, Trigger } from '@radix-ui/react-tooltip'
import {
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  forwardRef,
  type ReactNode,
} from 'react'
import { cn } from '@/utils/utils'
import { Kbd } from './kbd'

export const TooltipProvider = ({
  delayDuration = 0,
  ...props
}: ComponentProps<typeof Provider>) => <Provider delayDuration={delayDuration} {...props} />

export const Tooltip = Root

export const TooltipTrigger = forwardRef<
  ComponentRef<typeof Trigger>,
  ComponentPropsWithoutRef<typeof Trigger>
>(({ onFocus, ...props }, ref) => (
  <Trigger
    ref={ref}
    {...props}
    onFocus={(event) => {
      onFocus?.(event)
      if (!event.currentTarget.matches(':focus-visible')) event.preventDefault()
    }}
  />
))
TooltipTrigger.displayName = Trigger.displayName

export const TooltipContent = forwardRef<
  ComponentRef<typeof Content>,
  ComponentPropsWithoutRef<typeof Content> & { shortcut?: ReactNode | string[] }
>(({ className, sideOffset = 6, children, shortcut, ...props }, ref) => (
  <Portal>
    <Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 shadow-xl font-mono text-xs text-balance [word-spacing:-0.05em] text-primary-foreground tooltip-elegant',
        className,
      )}
      {...props}
    >
      {children}
      {shortcut && (
        <div className="flex items-center gap-1">
          {Array.isArray(shortcut) ? (
            shortcut.map((key, i) => <Kbd key={i}>{key}</Kbd>)
          ) : (
            <Kbd>{shortcut}</Kbd>
          )}
        </div>
      )}
      <Arrow className="fill-primary" />
    </Content>
  </Portal>
))
TooltipContent.displayName = Content.displayName
