'use client'

import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import * as React from 'react'
import { MENU_HIGHLIGHT_VIEWPORT_CLASS, MenuHighlight } from '@/components/ui/menu-highlight'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import { cn } from '@/utils/utils'

type DropdownSoundContextValue = {
  markSelectionClose: () => void
}

const CONTENT_CLASS =
  'dropdown-elegant relative z-50 min-w-[8rem] overflow-hidden rounded-xl bg-dropdown-background shadow-xl ring-1 ring-ring retina:ring-[0.5px]'

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
        {...props}
      />
    </DropdownSoundContext.Provider>
  )
}

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

function DropdownMenuViewport({ children }: { children: React.ReactNode }) {
  const viewportRef = React.useRef<HTMLDivElement>(null)

  return (
    <div ref={viewportRef} className={MENU_HIGHLIGHT_VIEWPORT_CLASS}>
      <MenuHighlight parentRef={viewportRef} />
      {children}
    </div>
  )
}

const DropdownMenuContent = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, children, ...props }, forwardedRef) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={forwardedRef}
      sideOffset={sideOffset}
      className={cn(CONTENT_CLASS, className)}
      {...props}
    >
      <DropdownMenuViewport>{children}</DropdownMenuViewport>
    </DropdownMenuPrimitive.Content>
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => {
  const { select, hoverTick } = useSoundEffects()
  const soundContext = React.useContext(DropdownSoundContext)

  return (
    <DropdownMenuPrimitive.Item
      ref={ref}
      {...props}
      onMouseEnter={(e) => {
        hoverTick()
        props.onMouseEnter?.(e)
      }}
      onSelect={(e) => {
        select()
        soundContext?.markSelectionClose()
        props.onSelect?.(e)
      }}
      className={cn(ITEM_CLASS, '[&>svg]:size-4 [&>svg]:shrink-0', inset && 'pl-8', className)}
      data-menu-highlight-item
    >
      {children}
    </DropdownMenuPrimitive.Item>
  )
})
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

export { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger }
