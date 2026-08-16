'use client'

import { Dialog } from '@base-ui/react/dialog'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import { CommandPalette } from '@/components/command/command-palette'
import { CommandTrigger } from '@/components/command/command-trigger'
import { EMAIL } from '@/constants/constants'
import { commandContent } from '@/data/content/command-content'
import {
  commandDomainGroups,
  commandEcosystem,
  commandElsewhere,
  commandPages,
  commandSocialGroups,
} from '@/data/static/command-links'
import { useAudioPreference } from '@/hooks/use-audio-preference'
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcut'
import { usePopupToggleSound } from '@/hooks/use-popup-toggle-sound'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import { useVisits } from '@/hooks/use-visits'
import type { CommandActionId, CommandExecutableItem, CommandGroup } from '@/types/command'

/**
 * The command menu, holding what it can do and what happens when something is chosen while the
 * palette below it handles the searching and drawing.
 *
 * Blogs and projects arrive as contentGroups, read on the server where the files are, and are
 * slotted between the fixed groups built here: the pages, the actions and the links out.
 *
 * The shortcut accepts either platform modifier without installing a second global listener.
 */
export function CommandMenu({ contentGroups }: { contentGroups: CommandGroup[] }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  /** State renders the dialog; the ref closes the gap between rapid events before React commits. */
  const isOpenRef = useRef(false)
  const [query, setQuery] = useState('')
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  const { isAudioEnabled, setAudioEnabled } = useAudioPreference()
  const { toggle, navigate: navigateSound, success, error } = useSoundEffects()
  const { recordVisit } = useVisits()
  const { markSelectionClose, playOpenChange } = usePopupToggleSound(toggle)

  const setMenuOpen = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen === isOpenRef.current) return
      isOpenRef.current = nextOpen

      /** Keep the current view intact through its close animation; reset just before the next open. */
      if (nextOpen) {
        setQuery('')
        setSelectedGroupId(null)
      }

      playOpenChange(nextOpen)
      setIsOpen(nextOpen)
    },
    [playOpenChange],
  )

  const toggleMenu = useCallback(() => setMenuOpen(!isOpenRef.current), [setMenuOpen])
  useKeyboardShortcut('k', toggleMenu, { ctrlOrMetaKey: true })

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
      switch (action) {
        case 'toggle-sound': {
          if (isAudioEnabled) {
            toggle(false)
            setAudioEnabled(false)
            return
          }

          setAudioEnabled(true)
          toggle(true)
          return
        }
        case 'copy-link':
          void copyToClipboard(window.location.href, commandContent.toasts.linkCopied)
          return
        case 'copy-email':
          void copyToClipboard(EMAIL, commandContent.toasts.emailCopied)
          return
        default: {
          const unhandledAction: never = action
          throw new Error(`Unhandled command action: ${unhandledAction}`)
        }
      }
    },
    [copyToClipboard, isAudioEnabled, setAudioEnabled, toggle],
  )

  /**
   * What a chosen entry does: run an action, open somewhere else in a new tab, or navigate here.
   *
   * The menu closes first either way, so nothing is left open behind whatever was asked for.
   */
  const handleSelect = useCallback(
    (item: CommandExecutableItem) => {
      markSelectionClose()
      setMenuOpen(false)

      if (item.kind === 'action') {
        runAction(item.action)
        return
      }

      navigateSound()

      if (item.external) {
        if (item.visitSlug) void recordVisit(item.visitSlug)
        window.open(item.href, '_blank', 'noopener,noreferrer')
        return
      }

      const destination = new URL(item.href, window.location.href)
      const isSamePageAnchor =
        destination.pathname === window.location.pathname && destination.hash.length > 0

      router.push(item.href, { scroll: isSamePageAnchor })
    },
    [markSelectionClose, navigateSound, recordVisit, router, runAction, setMenuOpen],
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
            kind: 'action',
            label: isAudioEnabled
              ? commandContent.actions.soundOff
              : commandContent.actions.soundOn,
            icon: isAudioEnabled ? 'sound' : 'soundOff',
            keywords: ['audio', 'volume', 'mute', 'unmute', 'effects'],
            action: 'toggle-sound',
          },
          {
            id: 'action-copy-link',
            kind: 'action',
            label: commandContent.actions.copyLink,
            icon: 'copy',
            keywords: ['share', 'url', 'clipboard'],
            action: 'copy-link',
          },
          {
            id: 'action-copy-email',
            kind: 'action',
            label: commandContent.actions.copyEmail,
            icon: 'mail',
            keywords: ['contact', 'address', 'clipboard', 'hire'],
            action: 'copy-email',
          },
        ],
      },
      {
        id: 'ecosystem',
        label: commandContent.groups.ecosystem,
        items: commandEcosystem,
      },
      /**
       * The parent carries no rows of its own, the two runs beneath it holding every domain. It
       * still has to be listed, since a section exists only where a group without a parent does.
       */
      { id: 'domains', label: commandContent.groups.domains, items: [] },
      ...commandDomainGroups,
      {
        id: 'elsewhere',
        /** The heading names only the repo and the feed, the row above names everything under it */
        label: commandContent.groups.site,
        sectionLabel: commandContent.groups.elsewhere,
        items: commandElsewhere,
      },
      ...commandSocialGroups,
    ],
    [contentGroups, isAudioEnabled],
  )

  return (
    <Dialog.Root open={isOpen} onOpenChange={setMenuOpen}>
      <CommandTrigger open={isOpen} />

      <CommandPalette
        open={isOpen}
        groups={groups}
        query={query}
        selectedGroupId={selectedGroupId}
        onQueryChange={setQuery}
        onSelectedGroupChange={setSelectedGroupId}
        onSelect={handleSelect}
      />
    </Dialog.Root>
  )
}
