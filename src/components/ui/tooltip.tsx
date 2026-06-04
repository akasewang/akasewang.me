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
/** Element that opens the tooltip on hover/focus. */
export const TooltipTrigger = Trigger

/**
 * Renders inside a React Portal to avoid z-index and overflow clipping issues.
 *
 * @param shortcut - Optional React node (usually a string key) to display inside a `<Kbd>` badge next to the text.
 */
export const TooltipContent = forwardRef<
  ComponentRef<typeof Content>,
  ComponentPropsWithoutRef<typeof Content> & { shortcut?: ReactNode }
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
      {shortcut && <Kbd>{shortcut}</Kbd>}
      <Arrow className="fill-primary" />
    </Content>
  </Portal>
))
TooltipContent.displayName = Content.displayName
