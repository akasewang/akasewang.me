'use client'

import { Menu as DropdownMenuPrimitive } from '@base-ui/react/menu'
import * as React from 'react'
import { MENU_HIGHLIGHT_VIEWPORT_CLASS, MenuHighlight } from '@/components/ui/menu-highlight'
import { usePopupToggleSound } from '@/hooks/use-popup-toggle-sound'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import { cn } from '@/utils/utils'

type DropdownSoundContextValue = {
  markSelectionClose: () => void
}

const CONTENT_CLASS =
  'dropdown-elegant relative z-50 min-w-32 overflow-hidden rounded-xl bg-dropdown-background shadow-xl outline-none ring-1 ring-ring retina:ring-[0.5px]'

const ITEM_CLASS =
  'group relative z-10 flex w-full cursor-default select-none items-center gap-2.5 whitespace-nowrap rounded-lg px-2.5 py-1 text-left text-xs font-medium tracking-tight text-secondary outline-none transition-colors duration-200 ease-in-out data-[highlighted]:text-primary data-[disabled]:pointer-events-none data-[disabled]:opacity-50'

/**
 * Lets an item tell the root that the close about to happen was a choice, so the close sound is
 * skipped and only the sound for what was picked is heard. Context rather than a prop, since items
 * are written by the caller and never see the root directly.
 */
const DropdownSoundContext = React.createContext<DropdownSoundContextValue | null>(null)

/** A dropdown styled to match the site, carrying the sliding highlight between its items */
const DropdownMenu: React.FC<React.ComponentProps<typeof DropdownMenuPrimitive.Root>> = ({
  onOpenChange,
  ...props
}) => {
  const { toggle } = useSoundEffects()
  const { markSelectionClose, playOpenChange } = usePopupToggleSound(toggle)
  const soundContextValue = React.useMemo(() => ({ markSelectionClose }), [markSelectionClose])

  return (
    <DropdownSoundContext.Provider value={soundContextValue}>
      <DropdownMenuPrimitive.Root
        onOpenChange={(open, eventDetails) => {
          playOpenChange(open)
          onOpenChange?.(open, eventDetails)
        }}
        {...props}
      />
    </DropdownSoundContext.Provider>
  )
}

function DropdownMenuTrigger(props: DropdownMenuPrimitive.Trigger.Props) {
  return <DropdownMenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />
}

/** The box the highlight box measures itself against, wrapped around whatever items are given */
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

/** The open menu, portalled out of whatever it was opened from and positioned against the trigger */
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

type DropdownMenuItemProps = Omit<DropdownMenuItemPrimitiveProps, 'className' | 'onClick'> & {
  className?: string
  inset?: boolean
  onClick?: (event: DropdownMenuItemEvent) => void
  onSelect?: (event: DropdownMenuItemEvent) => void
}

const DropdownMenuItem = React.forwardRef<HTMLElement, DropdownMenuItemProps>(
  ({ className, inset, onClick, onMouseEnter, onSelect, ...props }, ref) => {
    const { select, hoverTick } = useSoundEffects()
    const soundContext = React.useContext(DropdownSoundContext)

    return (
      <DropdownMenuPrimitive.Item
        data-slot="dropdown-menu-item"
        ref={ref}
        {...props}
        onMouseEnter={(event) => {
          hoverTick()
          onMouseEnter?.(event)
        }}
        onClick={(event) => {
          select()
          soundContext?.markSelectionClose()
          onSelect?.(event)
          onClick?.(event)

          /** A handler that cancelled the event means the menu should stay open too */
          if (event.defaultPrevented) event.preventBaseUIHandler()
        }}
        className={cn(ITEM_CLASS, '[&>svg]:size-4 [&>svg]:shrink-0', inset && 'pl-8', className)}
        data-menu-highlight-item
      />
    )
  },
)
DropdownMenuItem.displayName = 'DropdownMenuItem'

export { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger }
