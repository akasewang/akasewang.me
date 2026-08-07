'use client'

import { Dialog } from '@base-ui/react/dialog'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { CommandPalette } from '@/components/command/command-palette'
import { CommandTrigger } from '@/components/command/command-trigger'
import { EMAIL } from '@/constants/constants'
import { commandContent } from '@/data/content/command-content'
import { commandElsewhere, commandPages } from '@/data/static/command-links'
import { useAudioPreference } from '@/hooks/use-audio-preference'
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcut'
import { usePopupToggleSound } from '@/hooks/use-popup-toggle-sound'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import type { CommandActionId, CommandGroup, CommandItem } from '@/types/command'

/**
 * The command menu, holding what it can do and what happens when something is chosen while the
 * palette below it handles the searching and drawing.
 *
 * Blogs and projects arrive as contentGroups, read on the server where the files are, and are
 * slotted between the fixed groups built here: the pages, the actions and the links out.
 *
 * Both shortcuts are bound because the modifier differs by platform, and the browser reports only
 * the one actually pressed.
 */
export function CommandMenu({ contentGroups }: { contentGroups: CommandGroup[] }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const { isAudioEnabled, setAudioEnabled } = useAudioPreference()
  const { toggle, navigate: navigateSound, success, error } = useSoundEffects()
  const { markSelectionClose, playOpenChange } = usePopupToggleSound(toggle)

  const setMenuOpen = useCallback(
    (nextOpen: boolean) => {
      playOpenChange(nextOpen)
      setIsOpen(nextOpen)
      if (!nextOpen) setQuery('')
    },
    [playOpenChange],
  )

  useKeyboardShortcut('k', () => setMenuOpen(!isOpen), { metaKey: true })
  useKeyboardShortcut('k', () => setMenuOpen(!isOpen), { ctrlKey: true })

  const copyToClipboard = useCallback(
    async (value: string, message: string) => {
      try {
        await navigator.clipboard.writeText(value)
        success()
        toast.success(message)
      } catch {
        error()
        toast.error(commandContent.toasts.copyFailed)
      }
    },
    [error, success],
  )

  /** The entries that do something in place rather than going anywhere */
  const runAction = useCallback(
    (action: CommandActionId) => {
      if (action === 'toggle-sound') {
        if (isAudioEnabled) {
          toggle(false)
          setAudioEnabled(false)
          return
        }

        setAudioEnabled(true)
        toggle(true)
        return
      }

      if (action === 'copy-link') {
        void copyToClipboard(window.location.href, commandContent.toasts.linkCopied)
        return
      }

      void copyToClipboard(EMAIL, commandContent.toasts.emailCopied)
    },
    [copyToClipboard, isAudioEnabled, setAudioEnabled, toggle],
  )

  /**
   * What a chosen entry does: run an action, open somewhere else in a new tab, or navigate here.
   *
   * The menu closes first either way, so nothing is left open behind whatever was asked for.
   */
  const handleSelect = useCallback(
    (item: CommandItem) => {
      markSelectionClose()
      setMenuOpen(false)

      if (item.action) {
        runAction(item.action)
        return
      }

      if (!item.href) return

      navigateSound()

      if (item.external) {
        window.open(item.href, '_blank', 'noopener,noreferrer')
        return
      }

      router.push(item.href, { scroll: false })
    },
    [markSelectionClose, navigateSound, router, runAction, setMenuOpen],
  )

  /** Every group in the order the menu lists them, with the content groups slotted in the middle */
  const groups = useMemo<CommandGroup[]>(
    () => [
      { id: 'pages', label: commandContent.groups.pages, items: commandPages },
      ...contentGroups,
      {
        id: 'actions',
        label: commandContent.groups.actions,
        items: [
          {
            id: 'action-sound',
            label: isAudioEnabled
              ? commandContent.actions.soundOff
              : commandContent.actions.soundOn,
            icon: isAudioEnabled ? 'sound' : 'soundOff',
            keywords: ['audio', 'volume', 'mute', 'unmute', 'effects'],
            action: 'toggle-sound',
          },
          {
            id: 'action-copy-link',
            label: commandContent.actions.copyLink,
            icon: 'copy',
            keywords: ['share', 'url', 'clipboard'],
            action: 'copy-link',
          },
          {
            id: 'action-copy-email',
            label: commandContent.actions.copyEmail,
            icon: 'mail',
            keywords: ['contact', 'address', 'clipboard', 'hire'],
            action: 'copy-email',
          },
        ],
      },
      { id: 'elsewhere', label: commandContent.groups.elsewhere, items: commandElsewhere },
    ],
    [contentGroups, isAudioEnabled],
  )

  return (
    <Dialog.Root open={isOpen} onOpenChange={setMenuOpen}>
      <CommandTrigger open={isOpen} />

      <CommandPalette
        groups={groups}
        query={query}
        onQueryChange={setQuery}
        onSelect={handleSelect}
      />
    </Dialog.Root>
  )
}
