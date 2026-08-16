'use client'

import { AnimatePresence, m, type Transition } from 'framer-motion'
import { type ReactNode, useMemo, useRef, useState } from 'react'
import { HoverHighlight } from '@/components/ui/hover-highlight'
import { Icons } from '@/components/ui/icons'
import { EXPAND_TRANSITION } from '@/constants/ui'
import { sharedContent } from '@/data/content/landing-content'
import { occupiedHeight, useCollapseScroll } from '@/hooks/use-collapse-scroll'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import { cn } from '@/utils/utils'

interface ExpandableListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => ReactNode
  initialCount?: number
}

const TOGGLE_LABELS = [sharedContent.more, sharedContent.less] as const

/** Both labels stack in one grid cell, so the button is as wide as the longer of them and never
    changes width as they swap */
const CELL_CLASS = 'col-start-1 row-start-1 whitespace-nowrap'

/**
 * The padding is cancelled by matching negative margins, so clipping the height for the animation
 * does not also clip whatever a row draws outside itself, such as a hover highlight. Scroll
 * anchoring is switched off, since the browser correcting for the changing height would fight the
 * scroll adjustment made on collapse.
 */
const HIDDEN_BLOCK_CLASS = '-mb-4 -mx-4 overflow-hidden px-4 pb-4 [overflow-anchor:none]'

const LABEL_TRANSITION: Transition = { duration: 0.2, ease: 'easeOut' }

/**
 * A list that shows a few rows and reveals the rest behind a toggle.
 *
 * Collapsing is the awkward direction: the page above shrinks under the reader, so the scroll
 * position is adjusted by the height being removed and the view stays where it was rather than
 * jumping up the page.
 */
export function ExpandableList<T>({ items, renderItem, initialCount = 3 }: ExpandableListProps<T>) {
  const { toggle, hoverTick } = useSoundEffects()
  const [showAll, setShowAll] = useState(false)
  const reserveScrollRoom = useCollapseScroll()
  const hasMore = items.length > initialCount

  const visibleItems = useMemo(() => items.slice(0, initialCount), [items, initialCount])
  const hiddenItems = useMemo(() => items.slice(initialCount), [items, initialCount])

  const listRef = useRef<HTMLDivElement>(null)
  const hiddenRef = useRef<HTMLDivElement>(null)

  /** Collapsing is what needs the room reserved, since the page is about to get shorter under it */
  const handleToggle = () => {
    if (showAll) reserveScrollRoom(occupiedHeight(hiddenRef.current))
    toggle(!showAll)
    setShowAll((prev) => !prev)
  }

  return (
    <div ref={listRef} className="relative flex w-full flex-col">
      {/** Remounted on expand, so the highlight measures the new list rather than the old one */}
      <HoverHighlight key={showAll ? 'expanded' : 'collapsed'} parentRef={listRef} />
      <div className="flex flex-col gap-6">{visibleItems.map(renderItem)}</div>

      {hasMore && (
        <>
          <AnimatePresence initial={false}>
            {showAll && (
              <m.div
                ref={hiddenRef}
                key="expanded-list"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={EXPAND_TRANSITION}
                className={HIDDEN_BLOCK_CLASS}
              >
                <div className="flex flex-col gap-6 pt-6">
                  {hiddenItems.map((item, index) => renderItem(item, initialCount + index))}
                </div>
              </m.div>
            )}
          </AnimatePresence>

          <button
            type="button"
            onClick={handleToggle}
            onMouseEnter={hoverTick}
            className="group mt-6 inline-flex self-start items-center gap-1.5 text-sm text-muted-foreground transition-colors duration-300 supports-hover:hover:text-primary active:text-primary"
            aria-expanded={showAll}
          >
            <span className="relative grid after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 after:ease-out supports-hover:group-hover:after:scale-x-100 group-active:after:scale-x-100 retina:after:h-[0.5px]">
              {/** Both labels are laid in the same grid cell, so the button cannot change width */}
              {TOGGLE_LABELS.map((label) => (
                <span key={label} aria-hidden="true" className={cn(CELL_CLASS, 'invisible')}>
                  {label}
                </span>
              ))}

              <AnimatePresence initial={false}>
                <m.span
                  key={showAll ? 'less' : 'more'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={LABEL_TRANSITION}
                  className={CELL_CLASS}
                >
                  {showAll ? sharedContent.less : sharedContent.more}
                </m.span>
              </AnimatePresence>
            </span>

            <Icons.arrowForward
              aria-hidden="true"
              className={cn(
                'size-3.5 transition-transform duration-200 ease-out motion-reduce:transition-none',
                showAll
                  ? 'supports-hover:group-hover:-rotate-90 group-active:-rotate-90'
                  : 'supports-hover:group-hover:rotate-90 group-active:rotate-90',
              )}
            />
          </button>
        </>
      )}
    </div>
  )
}
