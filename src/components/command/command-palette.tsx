'use client'

import { Autocomplete } from '@base-ui/react/autocomplete'
import { Dialog } from '@base-ui/react/dialog'
import { AnimatePresence, m, type Variants } from 'framer-motion'
import { useRef, useState } from 'react'
import { commandIcons } from '@/components/command/command-icons'
import { Icons } from '@/components/ui/icons'
import { Kbd } from '@/components/ui/kbd'
import { MenuHighlight } from '@/components/ui/menu-highlight'
import { KEY_CAPS, type KeyCap } from '@/constants/keys'
import { BUTTON_SWAP_TRANSITION } from '@/constants/ui'
import { commandContent } from '@/data/content/command-content'
import { useScrollShadows } from '@/hooks/use-scroll-shadows'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import type { CommandGroup, CommandItem } from '@/types/command'
import { matchesCommandQuery, splitLabelByQuery } from '@/utils/command-utils'

interface CommandPaletteProps {
  groups: CommandGroup[]
  query: string
  onQueryChange: (query: string) => void
  onSelect: (item: CommandItem) => void
}

const OPEN_HINT_BY_GROUP: Record<string, string> = {
  pages: commandContent.hints.openPage,
  blogs: commandContent.hints.openPost,
  projects: commandContent.hints.openProject,
  actions: commandContent.hints.runAction,
  elsewhere: commandContent.hints.openLink,
}

const OPEN_LABEL_SWAP: Variants = {
  initial: { y: '110%' },
  animate: { y: '0%' },
  exit: { y: '-110%' },
}

const LEFT_HINTS = [
  { id: 'move', caps: [KEY_CAPS.arrowUp, KEY_CAPS.arrowDown], label: commandContent.hints.move },
  { id: 'close', caps: [KEY_CAPS.escape], label: commandContent.hints.close },
]

const OPEN_LABELS = [...Object.values(OPEN_HINT_BY_GROUP), commandContent.hints.open]

function CommandRow({
  item,
  active,
  query,
  onSelect,
}: {
  item: CommandItem
  active: boolean
  query: string
  onSelect: (item: CommandItem) => void
}) {
  const { hoverTick } = useSoundEffects()
  const Icon = commandIcons[item.icon]
  const parts = splitLabelByQuery(item.label, query)

  return (
    <Autocomplete.Item
      value={item}
      onClick={() => onSelect(item)}
      onMouseEnter={hoverTick}
      data-menu-highlight-item
      data-selected={active ? '' : undefined}
      className="group relative z-10 flex h-9 cursor-default select-none items-center gap-2.5 rounded-lg px-2.5 text-left text-xs font-medium tracking-tight text-secondary outline-none transition-colors duration-200 ease-in-out [scroll-margin-block:0.5rem] data-[highlighted]:text-primary"
    >
      <Icon className="size-4 shrink-0 text-muted-foreground transition-colors duration-200 group-data-[highlighted]:text-primary" />

      <span className="min-w-0 shrink truncate">
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
        <>
          <span
            aria-hidden="true"
            className="hidden h-0 min-w-4 flex-1 border-b border-dotted border-muted-foreground/25 transition-colors duration-200 group-data-[highlighted]:border-muted-foreground/40 sm:block"
          />

          <span className="ml-auto shrink-0 font-mono text-[11px] lowercase leading-none text-muted-foreground/60 transition-colors duration-200 group-data-[highlighted]:text-muted-foreground sm:ml-0">
            {item.meta}
          </span>
        </>
      )}
    </Autocomplete.Item>
  )
}

function HintKeys({ caps }: { caps: readonly KeyCap[] }) {
  return (
    <span className="flex items-center gap-1">
      {caps.map((cap) => (
        <Kbd
          key={cap.name}
          aria-label={cap.name}
          className="h-[18px] min-w-[18px] rounded-[5px] bg-muted/60 px-1.5 text-[10px] text-muted-foreground ring-ring/70"
        >
          {cap.glyph}
        </Kbd>
      ))}
    </span>
  )
}

/**
 * The command menu's search field, list and keyboard hints. What each entry does belongs to
 * CommandMenu above it, which this reports selections back to.
 */
export function CommandPalette({ groups, query, onQueryChange, onSelect }: CommandPaletteProps) {
  const listRef = useRef<HTMLDivElement>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const { scrollRef, topRef, bottomRef } = useScrollShadows<HTMLDivElement, HTMLDivElement>()

  const activeGroupId = groups.find((group) => group.items.some((item) => item.id === activeId))?.id
  const openLabel =
    (activeGroupId && OPEN_HINT_BY_GROUP[activeGroupId]) || commandContent.hints.open

  return (
    <Dialog.Portal>
      <Dialog.Backdrop className="command-backdrop fixed inset-0 z-[100] bg-background/80 backdrop-blur-md" />

      <Dialog.Viewport className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden p-4">
        <Dialog.Popup
          aria-label={commandContent.title}
          className="command-popup relative flex max-h-[min(28rem,calc(100dvh-2rem))] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-floating px-1 pb-1 shadow-xl outline-none ring-1 ring-inset ring-ring retina:ring-[0.5px] md:pb-0"
        >
          <Autocomplete.Root
            open
            inline
            items={groups}
            value={query}
            onValueChange={onQueryChange}
            itemToStringValue={(item: CommandItem) => item.label}
            filter={(item, itemQuery) => matchesCommandQuery(item as CommandItem, itemQuery)}
            autoHighlight="always"
            keepHighlight
            onItemHighlighted={(item) => setActiveId((item as CommandItem | undefined)?.id ?? null)}
          >
            <div className="group/field flex h-12 shrink-0 items-center gap-2.5 px-4">
              <Icons.search className="size-4 shrink-0 text-muted-foreground/60 transition-colors duration-300 group-has-[input:focus]/field:text-secondary" />

              <Autocomplete.Input
                aria-label={commandContent.inputLabel}
                placeholder={commandContent.placeholder}
                className="min-w-0 flex-1 bg-transparent font-mono text-sm lowercase text-primary caret-primary placeholder:text-muted-foreground/50 focus:outline-none"
              />

              <Dialog.Close
                aria-label={commandContent.closeLabel}
                className="-mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground/60 outline-none transition-colors duration-200 supports-hover:hover:text-primary active:text-primary md:hidden"
              >
                <Icons.close className="size-4" />
              </Dialog.Close>
            </div>

            <div className="relative flex min-h-0 flex-1 overflow-hidden rounded-xl bg-dropdown-background shadow-inner-sm ring-1 ring-inset ring-ring/60 retina:ring-[0.5px]">
              <div
                ref={(node) => {
                  listRef.current = node
                  scrollRef(node)
                }}
                className="scrollbar-hidden relative min-h-0 flex-1 overflow-y-auto overscroll-contain p-1.5 [scroll-padding-block:0.5rem]"
              >
                <MenuHighlight parentRef={listRef} returnToChecked />

                <Autocomplete.Empty>
                  <div className="flex select-none flex-col items-center justify-center gap-1.5 px-6 py-12 text-center">
                    <span className="text-balance font-serif text-base font-medium italic tracking-tight text-primary">
                      {commandContent.empty}
                    </span>
                    <span className="text-balance text-xs font-medium leading-relaxed text-muted-foreground/50">
                      {commandContent.emptyHint}
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
                      <Autocomplete.GroupLabel className="block select-none px-2.5 pb-2 pt-4 text-center outline-none">
                        <span className="block h-[0.72em] overflow-hidden font-sans text-[36px] font-bold uppercase leading-none tracking-tight text-muted-foreground/55 [mask-image:linear-gradient(to_bottom,#000_0%,#000_55%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,#000_0%,#000_55%,transparent_100%)]">
                          {group.label}
                        </span>
                      </Autocomplete.GroupLabel>

                      <Autocomplete.Collection>
                        {(item: CommandItem) => (
                          <CommandRow
                            key={item.id}
                            item={item}
                            active={item.id === activeId}
                            query={query}
                            onSelect={onSelect}
                          />
                        )}
                      </Autocomplete.Collection>
                    </Autocomplete.Group>
                  )}
                </Autocomplete.List>
              </div>

              <div
                ref={topRef}
                aria-hidden="true"
                className="command-edge-fade command-edge-fade--top"
              />
              <div
                ref={bottomRef}
                aria-hidden="true"
                className="command-edge-fade command-edge-fade--bottom"
              />
            </div>

            <div className="hidden h-11 shrink-0 items-center justify-between px-4 font-mono text-[11px] lowercase leading-none text-muted-foreground/60 md:flex">
              <div className="flex items-center gap-4">
                {LEFT_HINTS.map(({ id, caps, label }) => (
                  <span key={id} className="flex items-center gap-2">
                    <HintKeys caps={caps} />
                    {label}
                  </span>
                ))}
              </div>

              <span className="flex items-center gap-2">
                <span className="relative grid overflow-hidden leading-normal">
                  {OPEN_LABELS.map((label) => (
                    <span
                      key={label}
                      aria-hidden="true"
                      className="invisible col-start-1 row-start-1 whitespace-nowrap font-medium"
                    >
                      {label}
                    </span>
                  ))}

                  <AnimatePresence mode="popLayout" initial={false}>
                    <m.span
                      key={openLabel}
                      variants={OPEN_LABEL_SWAP}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={BUTTON_SWAP_TRANSITION}
                      className="col-start-1 row-start-1 whitespace-nowrap text-right font-medium text-primary"
                    >
                      {openLabel}
                    </m.span>
                  </AnimatePresence>
                </span>
                <HintKeys caps={[KEY_CAPS.enter]} />
              </span>
            </div>
          </Autocomplete.Root>
        </Dialog.Popup>
      </Dialog.Viewport>
    </Dialog.Portal>
  )
}
