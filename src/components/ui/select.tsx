'use client'

import { forwardRef, type ComponentRef, type ComponentPropsWithoutRef } from 'react'
import {
  Root,
  Value,
  Trigger,
  Content,
  Portal,
  Viewport,
  Item,
  ItemIndicator,
  ItemText,
  Icon,
} from '@radix-ui/react-select'
import { Icons } from '@/components/ui/icons'
import { cn } from '@/utils/utils'

const Select = Root
const SelectValue = Value

/** Contains the selected value text and a rotating chevron icon. */
const SelectTrigger = forwardRef<
  ComponentRef<typeof Trigger>,
  ComponentPropsWithoutRef<typeof Trigger>
>(({ className, children, ...props }, ref) => (
  <Trigger
    ref={ref}
    className={cn(
      'group flex h-10 w-full items-center justify-between gap-2 rounded-xl ring-1 ring-inset ring-ring retina:ring-[0.5px] bg-card px-4 text-sm font-medium lowercase text-secondary outline-none transition-[color,transform] duration-300 ease-out disabled:pointer-events-none disabled:opacity-50 [&>span]:line-clamp-1',
      'hover:text-primary',
      'active:scale-[0.99] active:text-primary',
      'data-[state=open]:scale-[0.99] data-[state=open]:text-primary',
      className,
    )}
    {...props}
  >
    {children}
    <Icon asChild>
      <Icons.chevronDown className="size-4 shrink-0 transition-transform duration-300 ease-out group-data-[state=open]:rotate-180" />
    </Icon>
  </Trigger>
))
SelectTrigger.displayName = Trigger.displayName

const SelectContent = forwardRef<
  ComponentRef<typeof Content>,
  ComponentPropsWithoutRef<typeof Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <Portal>
    <Content
      ref={ref}
      position={position}
      sideOffset={6}
      className={cn(
        'select-content-elegant relative z-50 max-h-96 overflow-hidden rounded-xl bg-dropdown-background p-1.5 shadow-xl ring-1 ring-ring retina:ring-[0.5px]',
        position === 'popper' && 'w-[var(--radix-select-trigger-width)]',
        className,
      )}
      {...props}
    >
      <Viewport
        className={cn(
          'flex flex-col gap-0.5',
          position === 'popper' && 'h-[var(--radix-select-content-available-height)]',
        )}
      >
        {children}
      </Viewport>
    </Content>
  </Portal>
))
SelectContent.displayName = Content.displayName

const SelectItem = forwardRef<ComponentRef<typeof Item>, ComponentPropsWithoutRef<typeof Item>>(
  ({ className, children, ...props }, ref) => (
    <Item
      ref={ref}
      className={cn(
        'group relative flex w-full select-none items-center gap-2.5 whitespace-nowrap rounded-lg px-2.5 py-1.5 pr-8 text-left text-xs font-medium tracking-tight text-secondary outline-none ring-1 ring-inset ring-transparent transition-[color,background-color,box-shadow] duration-200 ease-in-out',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        'data-[highlighted]:z-10 data-[highlighted]:bg-overlay-accent data-[highlighted]:text-primary data-[highlighted]:ring-overlay-accent-border',
        'data-[state=checked]:text-primary',
        className,
      )}
      {...props}
    >
      <ItemText>{children}</ItemText>
      <span className="absolute right-2.5 flex size-3.5 items-center justify-center">
        <ItemIndicator className="select-check-elegant">
          <Icons.check size={16} className="shrink-0 text-primary" />
        </ItemIndicator>
      </span>
    </Item>
  ),
)
SelectItem.displayName = Item.displayName

export { Select, SelectValue, SelectTrigger, SelectContent, SelectItem }
