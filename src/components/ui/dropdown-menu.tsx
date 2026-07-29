'use client'

import { Menu as DropdownMenuPrimitive } from '@base-ui/react/menu'
import * as React from 'react'
import { MENU_HIGHLIGHT_VIEWPORT_CLASS, MenuHighlight } from '@/components/ui/menu-highlight'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import { cn } from '@/utils/utils'

type DropdownSoundContextValue = {
  markSelectionClose: () => void
}

const CONTENT_CLASS =
  'dropdown-elegant relative z-50 min-w-[8rem] overflow-hidden rounded-xl bg-dropdown-background shadow-xl outline-none ring-1 ring-ring retina:ring-[0.5px]'

const ITEM_CLASS =
  'group relative z-10 flex w-full cursor-default select-none items-center gap-2.5 whitespace-nowrap rounded-lg px-2.5 py-1 text-left text-xs font-medium tracking-tight text-secondary outline-none transition-colors duration-200 ease-in-out data-[highlighted]:text-primary data-[disabled]:pointer-events-none data-[disabled]:opacity-50'

const DropdownSoundContext = React.createContext<DropdownSoundContextValue | null>(null)

const DropdownMenu: React.FC<React.ComponentProps<typeof DropdownMenuPrimitive.Root>> = ({
  onOpenChange,
  ...props
}) => {
  const { toggle } = useSoundEffects()
  const skipNextCloseSoundRef = React.useRef(false)
  const markSelectionClose = React.useCallback(() => {
    skipNextCloseSoundRef.current = true
  }, [])

  return (
    <DropdownSoundContext.Provider value={{ markSelectionClose }}>
      <DropdownMenuPrimitive.Root
        onOpenChange={(open, eventDetails) => {
          if (open) {
            toggle(true)
          } else if (skipNextCloseSoundRef.current) {
            skipNextCloseSoundRef.current = false
          } else {
            toggle(false)
          }

          onOpenChange?.(open, eventDetails)
        }}
        {...props}
      />
    </DropdownSoundContext.Provider>
  )
}

type DropdownMenuTriggerProps = Omit<
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Trigger>,
  'ref' | 'render'
> & {
  asChild?: boolean
}

const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, DropdownMenuTriggerProps>(
  ({ asChild, children, ...props }, ref) => (
    <DropdownMenuPrimitive.Trigger
      ref={ref}
      {...props}
      render={asChild && React.isValidElement(children) ? children : undefined}
    >
      {asChild ? undefined : children}
    </DropdownMenuPrimitive.Trigger>
  ),
)
DropdownMenuTrigger.displayName = 'DropdownMenuTrigger'

function DropdownMenuViewport({ children }: { children: React.ReactNode }) {
  const viewportRef = React.useRef<HTMLDivElement>(null)

  return (
    <div ref={viewportRef} className={MENU_HIGHLIGHT_VIEWPORT_CLASS}>
      <MenuHighlight parentRef={viewportRef} />
      {children}
    </div>
  )
}

type DropdownMenuPositionerProps = React.ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Positioner
>

type DropdownMenuContentProps = Omit<
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Popup>,
  'className'
> &
  Pick<
    DropdownMenuPositionerProps,
    'align' | 'alignOffset' | 'collisionAvoidance' | 'side' | 'sideOffset'
  > & {
    className?: string
  }

const DropdownMenuContent = React.forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  (
    { align, alignOffset, children, className, collisionAvoidance, side, sideOffset = 4, ...props },
    forwardedRef,
  ) => (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        collisionAvoidance={collisionAvoidance}
        side={side}
        sideOffset={sideOffset}
      >
        <DropdownMenuPrimitive.Popup
          ref={forwardedRef}
          className={cn(CONTENT_CLASS, className)}
          {...props}
        >
          <DropdownMenuViewport>{children}</DropdownMenuViewport>
        </DropdownMenuPrimitive.Popup>
      </DropdownMenuPrimitive.Positioner>
    </DropdownMenuPrimitive.Portal>
  ),
)
DropdownMenuContent.displayName = 'DropdownMenuContent'

type DropdownMenuItemPrimitiveProps = React.ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Item
>
type DropdownMenuItemEvent = Parameters<NonNullable<DropdownMenuItemPrimitiveProps['onClick']>>[0]

type DropdownMenuItemProps = Omit<
  DropdownMenuItemPrimitiveProps,
  'className' | 'onClick' | 'render'
> & {
  asChild?: boolean
  className?: string
  inset?: boolean
  onClick?: (event: DropdownMenuItemEvent) => void
  onSelect?: (event: DropdownMenuItemEvent) => void
}

const DropdownMenuItem = React.forwardRef<HTMLElement, DropdownMenuItemProps>(
  ({ asChild, className, inset, children, onClick, onSelect, ...props }, ref) => {
    const { select, hoverTick } = useSoundEffects()
    const soundContext = React.useContext(DropdownSoundContext)

    return (
      <DropdownMenuPrimitive.Item
        ref={ref}
        {...props}
        render={asChild && React.isValidElement(children) ? children : undefined}
        onMouseEnter={(event) => {
          hoverTick()
          props.onMouseEnter?.(event)
        }}
        onClick={(event) => {
          select()
          soundContext?.markSelectionClose()
          onSelect?.(event)
          onClick?.(event)

          if (event.defaultPrevented) event.preventBaseUIHandler()
        }}
        className={cn(ITEM_CLASS, '[&>svg]:size-4 [&>svg]:shrink-0', inset && 'pl-8', className)}
        data-menu-highlight-item
      >
        {asChild ? undefined : children}
      </DropdownMenuPrimitive.Item>
    )
  },
)
DropdownMenuItem.displayName = 'DropdownMenuItem'

export { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger }
