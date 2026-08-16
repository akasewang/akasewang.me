'use client'

import { Autocomplete } from '@base-ui/react/autocomplete'
import { Dialog } from '@base-ui/react/dialog'
import { LayoutGroup, m, useAnimationControls, useReducedMotion } from 'framer-motion'
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { commandIcons } from '@/components/command/command-icons'
import { Icons } from '@/components/ui/icons'
import { Kbd, KbdGroup } from '@/components/ui/kbd'
import { MenuHighlight } from '@/components/ui/menu-highlight'
import { TEXT_FLIP_SWAP_VARIANTS, TextFlip } from '@/components/ui/text-flip'
import { KEY_CAPS, type KeyCap } from '@/constants/keys'
import {
  BUTTON_SWAP_TRANSITION,
  COMMAND_CONTAINER_TRANSITION,
  COMMAND_VIEW_ENTER_TRANSITION,
  COMMAND_VIEW_EXIT_TRANSITION,
} from '@/constants/ui'
import { commandContent } from '@/data/content/command-content'
import { useScrollOverflow } from '@/hooks/use-scroll-overflow'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import type {
  CommandExecutableItem,
  CommandGroup,
  CommandIconName,
  CommandItem,
} from '@/types/command'
import {
  matchesCommandQuery,
  type PreparedCommandQuery,
  prepareCommandQuery,
  splitLabelByQuery,
} from '@/utils/command-utils'

interface CommandPaletteProps {
  open: boolean
  groups: CommandGroup[]
  query: string
  selectedGroupId: string | null
  onQueryChange: (query: string) => void
  onSelectedGroupChange: (groupId: string | null) => void
  onSelect: (item: CommandExecutableItem) => void
}

/** The icon a group is shown by once it has been opened as a section of its own */
const SECTION_ICON_BY_GROUP: Partial<Record<string, CommandIconName>> = {
  pages: 'home',
  blogs: 'blogs',
  projects: 'projects',
  actions: 'copy',
  ecosystem: 'cardholder',
  domains: 'globe',
  elsewhere: 'userCircle',
}

/**
 * The icon a row shows: its own, else its group's, else the icon of the section that group sits in.
 * A child group inherits from its parent, so a run only names an icon where it wants its own.
 */
const iconFor = (groups: CommandGroup[], group: CommandGroup, item?: CommandItem) => {
  const parent = group.parentGroupId
    ? groups.find((candidate) => candidate.id === group.parentGroupId)
    : undefined

  return (
    item?.icon ??
    group.icon ??
    parent?.icon ??
    SECTION_ICON_BY_GROUP[group.parentGroupId ?? group.id] ??
    'link'
  )
}

/** What Enter would do, worded for whatever is highlighted rather than as a generic open */
const OPEN_HINT_BY_GROUP: Record<string, string> = {
  pages: commandContent.hints.openPage,
  blogs: commandContent.hints.openPost,
  projects: commandContent.hints.openProject,
  actions: commandContent.hints.runAction,
  ecosystem: commandContent.hints.openSite,
  /** Keyed on the section, not its runs: drilling in selects the parent and draws the children */
  domains: commandContent.hints.openSite,
  elsewhere: commandContent.hints.openLink,
}

/**
 * Every wording the hint can take, so the flip between them can be sized to the longest. Two
 * sections are free to share a wording, so this can hold the same word twice and is keyed on
 * position rather than on the word itself.
 */
const OPEN_LABELS = [
  ...Object.values(OPEN_HINT_BY_GROUP),
  commandContent.hints.open,
  commandContent.hints.openSection,
]

/** One result: its icon, its label with the matched part picked out, and its date or excerpt */
function CommandRow({
  item,
  icon,
  preparedQuery,
  onSelect,
}: {
  item: CommandItem
  icon: CommandIconName
  preparedQuery: PreparedCommandQuery
  onSelect: (item: CommandItem) => void
}) {
  const { hoverTick } = useSoundEffects()
  const Icon = commandIcons[icon]
  const parts = splitLabelByQuery(item.label, preparedQuery)

  return (
    <Autocomplete.Item
      value={item}
      onClick={() => onSelect(item)}
      onMouseEnter={hoverTick}
      data-menu-highlight-item
      className="group relative z-10 flex cursor-default select-none items-start gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs font-medium leading-4 tracking-tight text-foreground outline-none transition-colors duration-200 ease-in-out [scroll-margin-block:0.5rem] data-[highlighted]:text-primary"
    >
      <Icon className="mt-[0.5px] size-3.5 shrink-0 text-foreground transition-colors duration-200 group-data-[highlighted]:text-primary" />

      <span className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="flex min-w-0 items-baseline gap-3">
          <span className="min-w-0 flex-1 truncate">
            {parts.map((part, index) =>
              part.match ? (
                <span key={`${part.text}-${index}`} className="font-semibold text-primary">
                  {part.text}
                </span>
              ) : (
                part.text
              ),
            )}
          </span>

          {item.meta && (
            <span className="shrink-0 font-mono text-3xs lowercase leading-none text-muted-foreground/60 transition-colors duration-200 group-data-[highlighted]:text-muted-foreground">
              {item.meta}
            </span>
          )}
        </span>

        {item.excerpt && (
          <span className="line-clamp-2 text-2xs font-normal leading-[1.45] tracking-normal text-muted-foreground/60 transition-colors duration-200 group-data-[highlighted]:text-muted-foreground/80">
            {item.excerpt}
          </span>
        )}
      </span>
    </Autocomplete.Item>
  )
}

/** The keys in the footer, drawn as glyphs where a name would read worse than the mark */
function HintKeys({ caps }: { caps: readonly KeyCap[] }) {
  return (
    <KbdGroup>
      {caps.map((cap) => {
        let Glyph: React.ReactNode = cap.glyph
        if (cap.name === 'Arrow up') Glyph = <Icons.arrowUpKey />
        else if (cap.name === 'Arrow down') Glyph = <Icons.arrowDownKey />
        else if (cap.name === 'Enter') Glyph = <Icons.enterKey />

        return (
          <Kbd key={cap.name} aria-label={cap.name}>
            {Glyph}
          </Kbd>
        )
      })}
    </KbdGroup>
  )
}

/**
 * The command menu's search field, list and keyboard hints. What each entry does belongs to
 * CommandMenu above it, which this reports selections back to.
 */
export function CommandPalette({
  open,
  groups,
  query,
  selectedGroupId,
  onQueryChange,
  onSelectedGroupChange,
  onSelect,
}: CommandPaletteProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const openRef = useRef(open)
  /** The ref guards async phases synchronously; state exposes the lock to the autocomplete UI. */
  const navigationPhaseRef = useRef<'idle' | 'exiting' | 'entering'>('idle')
  const [isChangingView, setIsChangingView] = useState(false)
  const viewControls = useAnimationControls()
  const reduceMotion = useReducedMotion()
  const { refreshScrollOverflow, scrollRef } = useScrollOverflow<HTMLDivElement>({
    contentSelector: '[data-menu-highlight-item]',
  })

  const selectedGroup = useMemo(
    () => groups.find((group) => group.id === selectedGroupId),
    [groups, selectedGroupId],
  )
  const selectedGroups = useMemo(
    () =>
      selectedGroup
        ? [selectedGroup, ...groups.filter((group) => group.parentGroupId === selectedGroup.id)]
        : [],
    [groups, selectedGroup],
  )
  /**
   * The top level view. Every group without a parent becomes one row, so the palette opens on a
   * list of places to go rather than on everything at once. A group counts its children's rows as
   * well as its own, since one can hold nothing itself and keep everything in the runs beneath it.
   */
  const sectionGroup = useMemo<CommandGroup>(
    () => ({
      id: 'sections',
      label: commandContent.groups.sections,
      items: groups
        .filter(
          (group) =>
            !group.parentGroupId &&
            (group.items.length > 0 ||
              groups.some((child) => child.parentGroupId === group.id && child.items.length > 0)),
        )
        .map((group) => ({
          id: `section-${group.id}`,
          kind: 'section',
          sectionId: group.id,
          label: group.sectionLabel ?? group.label,
          icon: SECTION_ICON_BY_GROUP[group.id] ?? iconFor(groups, group),
          keywords: [group.id, 'section'],
        })),
    }),
    [groups],
  )
  /**
   * An empty group is dropped rather than drawn, its label rendering whether or not rows follow.
   * The section list is built from the groups themselves, so a parent still gets its row there.
   */
  const displayedGroups = useMemo(
    () =>
      (selectedGroup ? selectedGroups : [sectionGroup]).filter((group) => group.items.length > 0),
    [sectionGroup, selectedGroup, selectedGroups],
  )
  const currentViewId = selectedGroup?.id ?? sectionGroup.id

  /** A new view is a different length, so the edge fades have to be measured again */
  // biome-ignore lint/correctness/useExhaustiveDependencies: currentViewId is the trigger rather than a value the body reads, and dropping it leaves the fades measured against the view before
  useLayoutEffect(() => {
    refreshScrollOverflow()
  }, [currentViewId, refreshScrollOverflow])

  const openLabel = selectedGroup
    ? OPEN_HINT_BY_GROUP[selectedGroup.id] || commandContent.hints.open
    : commandContent.hints.openSection
  const preparedQuery = useMemo(() => prepareCommandQuery(query), [query])
  const filterItem = useCallback(
    (item: CommandItem) => matchesCommandQuery(item, preparedQuery),
    [preparedQuery],
  )
  const leftHints = [
    {
      id: 'move',
      caps: [KEY_CAPS.arrowUp, KEY_CAPS.arrowDown],
      label: commandContent.hints.move,
    },
    {
      id: selectedGroup ? 'back' : 'close',
      caps: [KEY_CAPS.escape],
      label: selectedGroup ? commandContent.hints.back : commandContent.hints.close,
    },
  ]

  const focusInput = useCallback(
    () =>
      requestAnimationFrame(() => {
        if (openRef.current) inputRef.current?.focus()
      }),
    [],
  )
  const setListRef = useCallback(
    (node: HTMLDivElement | null) => {
      listRef.current = node
      scrollRef(node)
    },
    [scrollRef],
  )

  /**
   * Moves between the section list and a group, the outgoing view clearing the frame before the
   * incoming one enters. Awaited rather than declarative, since the two halves have to be ordered
   * and either can be interrupted by the palette closing part way through.
   */
  const changeView = async (groupId: string | null, direction: 1 | -1) => {
    if (navigationPhaseRef.current !== 'idle') return

    if (reduceMotion) {
      onSelectedGroupChange(groupId)
      onQueryChange('')
      listRef.current?.scrollTo({ top: 0 })
      focusInput()
      return
    }

    navigationPhaseRef.current = 'exiting'
    setIsChangingView(true)
    try {
      await viewControls.start({
        x: direction > 0 ? '-100%' : '100%',
        opacity: 0,
        transition: COMMAND_VIEW_EXIT_TRANSITION,
      })
    } catch {
      navigationPhaseRef.current = 'idle'
      setIsChangingView(false)
      return
    }

    /** Closed while the old view was leaving, so it is put back in place for the next opening */
    if (!openRef.current) {
      viewControls.set({ x: '0%', opacity: 1 })
      navigationPhaseRef.current = 'idle'
      setIsChangingView(false)
      return
    }

    viewControls.set({ x: direction > 0 ? '100%' : '-100%', opacity: 0 })
    navigationPhaseRef.current = 'entering'
    onSelectedGroupChange(groupId)
    onQueryChange('')
  }

  useLayoutEffect(() => {
    openRef.current = open

    if (!open && navigationPhaseRef.current !== 'idle') {
      viewControls.stop()
      viewControls.set({ x: '0%', opacity: 1 })
      navigationPhaseRef.current = 'idle'
    }

    if (navigationPhaseRef.current === 'idle') {
      if (!isChangingView) return
      const resetFrame = requestAnimationFrame(() => setIsChangingView(false))
      return () => cancelAnimationFrame(resetFrame)
    }

    if (navigationPhaseRef.current !== 'entering') return

    const list = listRef.current
    if (list?.dataset.commandView !== currentViewId) return
    list.scrollTo({ top: 0 })
    let cancelled = false

    const frame = requestAnimationFrame(() => {
      void viewControls
        .start({
          x: '0%',
          opacity: 1,
          transition: COMMAND_VIEW_ENTER_TRANSITION,
        })
        .then(() => {
          if (cancelled) return
          navigationPhaseRef.current = 'idle'
          setIsChangingView(false)
          focusInput()
        })
        .catch(() => {
          if (cancelled) return
          navigationPhaseRef.current = 'idle'
          setIsChangingView(false)
        })
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
    }
  }, [currentViewId, focusInput, isChangingView, open, viewControls])

  const showSections = () => void changeView(null, -1)

  const handleSelect = (item: CommandItem) => {
    if (item.kind === 'section') {
      if (selectedGroup || !groups.some((group) => group.id === item.sectionId)) return

      void changeView(item.sectionId, 1)
      return
    }

    onSelect(item)
  }

  return (
    <Dialog.Portal>
      <Dialog.Backdrop className="command-backdrop fixed inset-0 z-[100] bg-background/40 backdrop-blur-sm" />

      <Dialog.Viewport className="fixed inset-0 z-[100] flex items-start justify-center overflow-hidden px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,10dvh)] sm:px-4 md:pt-[16dvh]">
        <Dialog.Popup
          aria-label={commandContent.title}
          className="command-popup relative flex max-h-[min(32rem,calc(100dvh-max(1.5rem,20dvh)))] w-full max-w-xl flex-col overflow-hidden rounded-[1rem] bg-surface-20 shadow-2xl outline-none ring-1 ring-inset ring-ring/40 retina:ring-[0.5px] md:max-h-[min(32rem,68dvh)]"
        >
          <Autocomplete.Root
            open
            inline
            disabled={isChangingView}
            items={displayedGroups}
            value={query}
            onValueChange={(nextQuery, eventDetails) => {
              if (eventDetails.reason !== 'item-press') onQueryChange(nextQuery)
            }}
            itemToStringValue={(item: CommandItem) => item.label}
            filter={filterItem}
            autoHighlight="always"
            keepHighlight
          >
            <div className="group/field flex h-11 shrink-0 items-center gap-2.5 px-4">
              {selectedGroup ? (
                <button
                  type="button"
                  disabled={isChangingView}
                  aria-label={`Back to ${commandContent.groups.sections.toLowerCase()}`}
                  onClick={showSections}
                  className="-mx-1 flex size-6 shrink-0 items-center justify-center text-muted-foreground/60 outline-none transition-colors duration-200 focus-visible:text-primary supports-hover:hover:text-primary"
                >
                  <Icons.arrowUUpLeft className="size-4" />
                </button>
              ) : (
                <Icons.search className="size-4 shrink-0 text-muted-foreground/60 transition-colors duration-200 group-has-[input:focus]/field:text-primary" />
              )}

              <Autocomplete.Input
                ref={inputRef}
                aria-label={commandContent.inputLabel}
                enterKeyHint="go"
                placeholder={
                  selectedGroup
                    ? `search ${selectedGroup.label.toLowerCase()}`
                    : commandContent.placeholder
                }
                onKeyDown={(event) => {
                  if (!selectedGroup) return
                  if (event.key !== 'Escape' && !(event.key === 'Backspace' && !query)) return

                  event.preventDefault()
                  event.stopPropagation()
                  showSections()
                }}
                className="h-4.5 min-w-0 flex-1 bg-transparent py-0 font-mono text-xs-plus leading-4.5 lowercase text-primary caret-primary placeholder:text-muted-foreground/45 focus:outline-none"
              />

              <Dialog.Close
                aria-label={commandContent.closeLabel}
                className="-mr-1 flex size-8 shrink-0 items-center justify-center text-muted-foreground/70 outline-none transition-[color,transform] duration-200 focus-visible:text-primary supports-hover:hover:text-primary active:scale-95 active:text-primary md:hidden"
              >
                <Icons.close className="size-4" />
              </Dialog.Close>
            </div>

            <LayoutGroup id="command-view-layout">
              <m.div
                layout={reduceMotion ? false : 'size'}
                transition={{ layout: COMMAND_CONTAINER_TRANSITION }}
                className="relative mx-1 flex min-h-0 flex-1 overflow-hidden rounded-[0.75rem] bg-dropdown-background shadow-inner-sm ring-1 ring-inset ring-ring/60 retina:ring-[0.5px]"
              >
                <m.div
                  animate={viewControls}
                  ref={setListRef}
                  aria-busy={isChangingView}
                  data-command-view={currentViewId}
                  className="scroll-fade-y scrollbar-hidden relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-1.5 pb-1.75 pt-1.5 [scroll-padding-block:0.5rem]"
                >
                  <MenuHighlight parentRef={listRef} className="rounded-xl shadow-sm" />

                  <Autocomplete.Empty>
                    <div className="flex min-h-40 select-none items-center justify-center px-6 py-10 text-center">
                      <span className="text-balance font-serif text-base font-medium italic tracking-tight text-primary">
                        {commandContent.empty}
                      </span>
                    </div>
                  </Autocomplete.Empty>

                  <Autocomplete.List>
                    {(group: CommandGroup) => (
                      <Autocomplete.Group
                        key={group.id}
                        items={group.items}
                        className="flex flex-col not-last:mb-1"
                      >
                        <Autocomplete.GroupLabel className="block select-none px-2.5 pb-1 pt-1.5 outline-none">
                          <span className="text-2xs font-medium text-muted-foreground">
                            {group.label}
                          </span>
                        </Autocomplete.GroupLabel>

                        <Autocomplete.Collection>
                          {(item: CommandItem) => (
                            <CommandRow
                              key={item.id}
                              item={item}
                              icon={iconFor(groups, group, item)}
                              preparedQuery={preparedQuery}
                              onSelect={handleSelect}
                            />
                          )}
                        </Autocomplete.Collection>
                      </Autocomplete.Group>
                    )}
                  </Autocomplete.List>
                </m.div>
              </m.div>

              <m.div
                layout={reduceMotion ? false : 'position'}
                transition={{ layout: COMMAND_CONTAINER_TRANSITION }}
                className="flex h-10 shrink-0 items-center justify-between px-4 font-mono text-3xs lowercase leading-none text-muted-foreground/60"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  {leftHints.map(({ id, caps, label }) => (
                    <span key={id} className="flex items-center gap-2">
                      <HintKeys caps={caps} />
                      <span className="hidden sm:inline">{label}</span>
                    </span>
                  ))}
                </div>

                <span className="flex items-center gap-2">
                  <span className="relative hidden overflow-hidden leading-normal sm:grid">
                    {/** Keyed on position, two sections being free to share a wording */}
                    {OPEN_LABELS.map((label, index) => (
                      <span
                        key={`${label}-${index}`}
                        aria-hidden="true"
                        className="invisible col-start-1 row-start-1 whitespace-nowrap font-medium"
                      >
                        {label}
                      </span>
                    ))}

                    <TextFlip
                      activeKey={openLabel}
                      layout={false}
                      variants={TEXT_FLIP_SWAP_VARIANTS}
                      transition={BUTTON_SWAP_TRANSITION}
                      className="col-start-1 row-start-1 whitespace-nowrap text-right font-medium text-primary"
                    >
                      {openLabel}
                    </TextFlip>
                  </span>
                  <HintKeys caps={[KEY_CAPS.enter]} />
                </span>
              </m.div>
            </LayoutGroup>
          </Autocomplete.Root>
        </Dialog.Popup>
      </Dialog.Viewport>
    </Dialog.Portal>
  )
}
