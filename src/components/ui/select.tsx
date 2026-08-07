'use client'

import { Select as SelectPrimitive } from '@base-ui/react/select'
import { forwardRef, type ReactNode, useRef } from 'react'
import { Icons } from '@/components/ui/icons'
import { MENU_HIGHLIGHT_VIEWPORT_CLASS, MenuHighlight } from '@/components/ui/menu-highlight'
import { usePopupToggleSound } from '@/hooks/use-popup-toggle-sound'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import { cn } from '@/utils/utils'

type SelectProps = Omit<SelectPrimitive.Root.Props<string>, 'onValueChange'> & {
  onValueChange?: (value: string) => void
}

/** A select styled to match the site, used by the sort control on filtered lists */
const Select = ({ onOpenChange, onValueChange, ...props }: SelectProps) => {
  const { toggle, select } = useSoundEffects()
  const { markSelectionClose, playOpenChange } = usePopupToggleSound(toggle)

  return (
    <SelectPrimitive.Root
      {...props}
      onOpenChange={(open, eventDetails) => {
        playOpenChange(open)
        onOpenChange?.(open, eventDetails)
      }}
      onValueChange={(value) => {
        if (value === null) return

        markSelectionClose()
        select()
        onValueChange?.(value)
      }}
    />
  )
}

const SelectValue = SelectPrimitive.Value

type SelectTriggerProps = Omit<SelectPrimitive.Trigger.Props, 'className'> & {
  className?: string
}

const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const { hoverTick } = useSoundEffects()
    return (
      <SelectPrimitive.Trigger
        ref={ref}
        {...props}
        className={cn(
          'group flex h-10 w-full items-center justify-between gap-2 rounded-xl ring-1 ring-inset ring-ring retina:ring-[0.5px] bg-card px-4 text-sm font-medium lowercase text-secondary outline-none transition-[color,transform] duration-300 ease-out disabled:pointer-events-none disabled:opacity-50 [&>span]:line-clamp-1',
          'supports-hover:hover:text-primary',
          'active:scale-[0.99] active:text-primary',
          'data-[popup-open]:scale-[0.99] data-[popup-open]:text-primary',
          className,
        )}
        onMouseEnter={(event) => {
          hoverTick()
          props.onMouseEnter?.(event)
        }}
      >
        {children}
        <SelectPrimitive.Icon
          render={
            <Icons.chevronDown className="size-4 shrink-0 transition-transform duration-300 ease-out group-data-[popup-open]:rotate-180" />
          }
        />
      </SelectPrimitive.Trigger>
    )
  },
)
SelectTrigger.displayName = 'SelectTrigger'

type SelectPositionerProps = SelectPrimitive.Positioner.Props
type SelectPopupProps = SelectPrimitive.Popup.Props

type SelectContentProps = Omit<SelectPopupProps, 'children' | 'className'> &
  Pick<
    SelectPositionerProps,
    'align' | 'alignOffset' | 'collisionAvoidance' | 'side' | 'sideOffset'
  > & {
    children?: ReactNode
    className?: string
    position?: 'item-aligned' | 'popper'
  }

const SelectContent = forwardRef<HTMLDivElement, SelectContentProps>(
  (
    {
      align,
      alignOffset,
      children,
      className,
      collisionAvoidance,
      position = 'popper',
      side,
      sideOffset = 6,
      ...props
    },
    forwardedRef,
  ) => {
    const listRef = useRef<HTMLDivElement>(null)

    return (
      <SelectPrimitive.Portal>
        <SelectPrimitive.Positioner
          align={align}
          alignItemWithTrigger={position === 'item-aligned'}
          alignOffset={alignOffset}
          collisionAvoidance={collisionAvoidance}
          side={side}
          sideOffset={sideOffset}
        >
          <SelectPrimitive.Popup
            ref={forwardedRef}
            className={cn(
              'select-content-elegant relative z-50 max-h-96 overflow-hidden rounded-xl bg-dropdown-background shadow-xl outline-none ring-1 ring-ring retina:ring-[0.5px]',
              position === 'popper' && 'w-[var(--anchor-width)]',
              className,
            )}
            {...props}
          >
            <SelectPrimitive.List
              ref={listRef}
              className={cn(
                MENU_HIGHLIGHT_VIEWPORT_CLASS,
                'max-h-[var(--available-height)] overflow-y-auto',
              )}
            >
              <MenuHighlight parentRef={listRef} returnToChecked />
              {children}
            </SelectPrimitive.List>
          </SelectPrimitive.Popup>
        </SelectPrimitive.Positioner>
      </SelectPrimitive.Portal>
    )
  },
)
SelectContent.displayName = 'SelectContent'

type SelectItemProps = Omit<SelectPrimitive.Item.Props, 'className'> & {
  className?: string
}

const SelectItem = forwardRef<HTMLElement, SelectItemProps>(
  ({ className, children, ...props }, ref) => {
    const { hoverTick } = useSoundEffects()
    return (
      <SelectPrimitive.Item
        ref={ref}
        {...props}
        onMouseEnter={(event) => {
          hoverTick()
          props.onMouseEnter?.(event)
        }}
        className={cn(
          'group relative z-10 flex w-full select-none items-center gap-2.5 whitespace-nowrap rounded-lg px-2.5 py-1.5 pr-8 text-left text-xs font-medium tracking-tight text-secondary outline-none ring-1 ring-inset ring-transparent transition-colors duration-200 ease-in-out',
          'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
          'data-[highlighted]:text-primary',
          'data-[selected]:text-primary',
          className,
        )}
        data-menu-highlight-item
      >
        <span className="relative z-10 flex w-full items-center gap-2">
          <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        </span>
        <span className="absolute right-2.5 z-10 flex size-3.5 items-center justify-center">
          <SelectPrimitive.ItemIndicator className="select-check-elegant">
            <Icons.check size={16} weight="regular" className="shrink-0 text-primary" />
          </SelectPrimitive.ItemIndicator>
        </span>
      </SelectPrimitive.Item>
    )
  },
)
SelectItem.displayName = 'SelectItem'

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue }
