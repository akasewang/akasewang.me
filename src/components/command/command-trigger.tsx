'use client'

import { Dialog } from '@base-ui/react/dialog'
import { m } from 'framer-motion'
import { Icons } from '@/components/ui/icons'
import { Kbd } from '@/components/ui/kbd'
import { KEY_CAPS } from '@/constants/keys'
import { SMOOTH_SPRING_TRANSITION } from '@/constants/ui'
import { commandContent } from '@/data/content/command-content'
import { usePlatformModifier } from '@/hooks/use-platform-modifier'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import { cn } from '@/utils/utils'

/** The button that opens the command menu, showing the shortcut for the reader's own platform */
export function CommandTrigger({ open }: { open: boolean }) {
  const { hoverLink } = useSoundEffects()
  const modifier = usePlatformModifier()

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-8 z-50 flex justify-center px-8 md:bottom-10">
      <Dialog.Trigger
        aria-keyshortcuts="Meta+K Control+K"
        onMouseEnter={hoverLink}
        render={
          <m.button
            type="button"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={open ? { opacity: 0, y: 6, scale: 0.98 } : { opacity: 1, y: 0, scale: 1 }}
            transition={SMOOTH_SPRING_TRANSITION}
            whileTap={{ scale: 0.97 }}
          />
        }
        className={cn(
          'group flex h-8 items-center gap-3 rounded-lg bg-floating pl-3 pr-1.5 shadow-md',
          'ring-1 ring-inset ring-ring/70 retina:ring-[0.5px]',
          'transition-[box-shadow] duration-300 supports-hover:hover:shadow-lg supports-hover:hover:ring-ring',
          open ? 'pointer-events-none' : 'pointer-events-auto',
        )}
      >
        <span className="flex items-center gap-2">
          <Icons.search className="size-3.5 shrink-0 text-muted-foreground transition-colors duration-300 supports-hover:group-hover:text-secondary" />

          <span className="font-mono text-xs font-medium lowercase leading-none text-secondary transition-colors duration-300 supports-hover:group-hover:text-primary group-active:text-primary">
            {commandContent.trigger}
          </span>
        </span>

        <span className="flex items-center gap-0.5 text-muted-foreground transition-colors duration-300 supports-hover:group-hover:text-secondary">
          <Kbd aria-label={modifier.name}>{modifier.glyph}</Kbd>
          <Kbd aria-label={KEY_CAPS.k.name}>{KEY_CAPS.k.glyph}</Kbd>
        </span>
      </Dialog.Trigger>
    </div>
  )
}
