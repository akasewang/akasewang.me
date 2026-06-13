'use client'

import {
  forwardRef,
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type ReactNode,
} from 'react'
import { Provider, Root, Trigger, Content, Portal, Arrow } from '@radix-ui/react-tooltip'
import { cn } from '@/utils/utils'
import { Kbd } from './kbd'

/** Tooltip wrapper that provides context to its children. */
export const TooltipProvider = ({
  delayDuration = 0,
  ...props
}: ComponentProps<typeof Provider>) => <Provider delayDuration={delayDuration} {...props} />

/** Tooltip root; wraps a trigger and content pair. */
export const Tooltip = Root

/**
 * Element that opens the tooltip on hover or keyboard focus.
 *
 * Only keyboard focus (`:focus-visible`) opens the tooltip; pointer clicks and programmatic
 * focus restoration (such as a dropdown, dialog or sonner toast returning focus to the trigger
 * on close) are ignored so the tooltip never reappears without a hover. Those focus events are
 * suppressed with `preventDefault()`, which Radix treats as a signal to skip its internal open
 * handler. Hover opens the tooltip through a separate code path and is unaffected.
 */
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

/**
 * Renders inside a React Portal to avoid z-index and overflow clipping issues.
 *
 * @param shortcut - Optional React node (usually a string key) to display inside a `<Kbd>` badge next to the text.
 */
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
