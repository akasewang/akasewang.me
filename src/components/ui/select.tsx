'use client'

import {
  Content,
  Icon,
  Item,
  ItemIndicator,
  ItemText,
  Portal,
  Root,
  Trigger,
  Value,
  Viewport,
} from '@radix-ui/react-select'
import {
  type ComponentPropsWithoutRef,
  type ComponentRef,
  forwardRef,
  useCallback,
  useRef,
} from 'react'
import { Icons } from '@/components/ui/icons'
import { MenuHighlight } from '@/components/ui/menu-highlight'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import { cn } from '@/utils/utils'

const Select: React.FC<React.ComponentProps<typeof Root>> = ({
  onOpenChange,
  onValueChange,
  ...props
}) => {
  const { toggle, select } = useSoundEffects()
  const skipNextCloseSoundRef = useRef(false)

  return (
    <Root
      {...props}
      onOpenChange={(open) => {
        if (open) {
          toggle(true)
        } else if (skipNextCloseSoundRef.current) {
          skipNextCloseSoundRef.current = false
        } else {
          toggle(false)
        }

        onOpenChange?.(open)
      }}
      onValueChange={(value) => {
        skipNextCloseSoundRef.current = true
        select()
        onValueChange?.(value)
      }}
    />
  )
}
const SelectValue = Value

/** Contains the selected value text and a rotating chevron icon. */
const SelectTrigger = forwardRef<
  ComponentRef<typeof Trigger>,
  ComponentPropsWithoutRef<typeof Trigger>
>(({ className, children, ...props }, ref) => {
  const { hoverTick } = useSoundEffects()
  return (
    <Trigger
      ref={ref}
      {...props}
      className={cn(
        'group flex h-10 w-full items-center justify-between gap-2 rounded-xl ring-1 ring-inset ring-ring retina:ring-[0.5px] bg-card px-4 text-sm font-medium lowercase text-secondary outline-none transition-[color,transform] duration-300 ease-out disabled:pointer-events-none disabled:opacity-50 [&>span]:line-clamp-1',
        'hover:text-primary',
        'active:scale-[0.99] active:text-primary',
        'data-[state=open]:scale-[0.99] data-[state=open]:text-primary',
        className,
      )}
      onMouseEnter={(e) => {
        hoverTick()
        props.onMouseEnter?.(e)
      }}
    >
      {children}
      <Icon asChild>
        <Icons.chevronDown className="size-4 shrink-0 transition-transform duration-300 ease-out group-data-[state=open]:rotate-180" />
      </Icon>
    </Trigger>
  )
})
SelectTrigger.displayName = Trigger.displayName

/**
 * Renders the select menu panel.
 * Automatically injects the `MenuHighlight` background for zero lag fluid hover effects.
 */
const SelectContent = forwardRef<
  ComponentRef<typeof Content>,
  ComponentPropsWithoutRef<typeof Content>
>(({ className, children, position = 'popper', ...props }, forwardedRef) => {
  const internalRef = useRef<HTMLDivElement>(null)

  const ref = useCallback(
    (node: HTMLDivElement | null) => {
      internalRef.current = node
      if (typeof forwardedRef === 'function') forwardedRef(node)
      else if (forwardedRef) forwardedRef.current = node
    },
    [forwardedRef],
  )

  return (
    <Portal>
      <Content
        ref={ref}
        position={position}
        sideOffset={6}
        className={cn(
          'select-content-elegant relative z-50 max-h-96 overflow-hidden rounded-xl bg-dropdown-background shadow-xl ring-1 ring-ring retina:ring-[0.5px]',
          position === 'popper' && 'w-[var(--radix-select-trigger-width)]',
          className,
        )}
        {...props}
      >
        <Viewport
          className={cn(
            'relative flex flex-col gap-0.5 p-1.5',
            position === 'popper' && 'h-[var(--radix-select-content-available-height)]',
          )}
        >
          <MenuHighlight parentRef={internalRef} />
          {children}
        </Viewport>
      </Content>
    </Portal>
  )
})
SelectContent.displayName = Content.displayName

const SelectItem = forwardRef<ComponentRef<typeof Item>, ComponentPropsWithoutRef<typeof Item>>(
  ({ className, children, ...props }, ref) => {
    const { hoverTick } = useSoundEffects()
    return (
      <Item
        ref={ref}
        {...props}
        onMouseEnter={(e) => {
          hoverTick()
          props.onMouseEnter?.(e)
        }}
        className={cn(
          'group relative flex w-full select-none items-center gap-2.5 whitespace-nowrap rounded-lg px-2.5 py-1.5 pr-8 text-left text-xs font-medium tracking-tight text-secondary outline-none ring-1 ring-inset ring-transparent transition-colors duration-200 ease-in-out',
          'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
          'data-[highlighted]:z-10 data-[highlighted]:text-primary',
          'data-[state=checked]:text-primary',
          className,
        )}
      >
        <span className="relative z-10 flex w-full items-center gap-2">
          <ItemText>{children}</ItemText>
        </span>
        <span className="absolute right-2.5 z-10 flex size-3.5 items-center justify-center">
          <ItemIndicator className="select-check-elegant">
            <Icons.check size={16} className="shrink-0 text-primary" />
          </ItemIndicator>
        </span>
      </Item>
    )
  },
)
SelectItem.displayName = Item.displayName

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue }
