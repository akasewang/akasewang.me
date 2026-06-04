'use client'

import { useState, useMemo, type ReactNode } from 'react'
import { m, AnimatePresence, type Transition } from 'framer-motion'
import { Icons } from '@/components/ui/icons'
import { sharedContent } from '@/data/content/landing-content'
import { cn } from '@/utils/utils'

interface ExpandableListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => ReactNode
  initialCount?: number
}

const smoothTransition: Transition = { duration: 0.3, ease: 'easeInOut' }

/**
 * A generic list component that initially displays a subset of items.
 *
 * @param items - The full array of data items to render.
 * @param renderItem - A render prop function that returns the ReactNode for a single item.
 * @param initialCount - The number of items to show before truncating the list (defaults to 3).
 */
export function ExpandableList<T>({ items, renderItem, initialCount = 3 }: ExpandableListProps<T>) {
  const [showAll, setShowAll] = useState(false)
  const hasMore = items.length > initialCount

  const visibleItems = useMemo(() => items.slice(0, initialCount), [items, initialCount])
  const hiddenItems = useMemo(() => items.slice(initialCount), [items, initialCount])

  return (
    <div className="flex w-full flex-col">
      <div className="flex flex-col gap-6">{visibleItems.map(renderItem)}</div>

      {hasMore && (
        <>
          <AnimatePresence initial={false}>
            {showAll && (
              <m.div
                key="expanded-list"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={smoothTransition}
                className="-mb-4 -mx-4 overflow-hidden px-4 pb-4"
              >
                <div className="flex flex-col gap-6 pt-6">
                  {hiddenItems.map((item, index) => renderItem(item, initialCount + index))}
                </div>
              </m.div>
            )}
          </AnimatePresence>

          <m.button
            layout
            transition={smoothTransition}
            onClick={() => setShowAll((prev) => !prev)}
            className="group mt-6 inline-flex self-start items-center gap-1.5 text-sm text-muted-foreground transition-colors duration-300 hover:text-primary"
            aria-expanded={showAll}
          >
            <m.span
              layout
              transition={smoothTransition}
              className="relative flex items-center after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-[width] after:duration-300 group-hover:after:w-full"
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <m.span
                  key={showAll ? 'less' : 'more'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={smoothTransition}
                  className="inline-block whitespace-nowrap"
                >
                  {showAll ? sharedContent.less : sharedContent.more}
                </m.span>
              </AnimatePresence>
            </m.span>

            <Icons.arrowForward
              aria-hidden="true"
              className={cn(
                'size-3.5 transition-transform duration-300',
                showAll ? 'group-hover:-rotate-90' : 'group-hover:rotate-90',
              )}
            />
          </m.button>
        </>
      )}
    </div>
  )
}
