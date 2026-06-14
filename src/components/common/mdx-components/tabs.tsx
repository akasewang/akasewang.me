'use client'

import * as RadixTabs from '@radix-ui/react-tabs'
import { AnimatePresence, m } from 'framer-motion'
import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  SMOOTH_SPRING_TRANSITION,
  SPRING_TRANSITION,
  SWIPE_TRANSITION,
  SWIPE_VARIANTS,
} from '@/constants/ui'
import { useMeasuredHeight } from '@/hooks/use-measured-height'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import { cn } from '@/utils/utils'
import { TabPanelContext } from './contexts/tab-panel-context'

/** Props for {@link Tabs}. */
interface TabsProps {
  items?: string[]
  defaultIndex?: number
  className?: string
  children: ReactNode
}

/** Props for {@link Tab}. */
interface TabProps {
  title?: string
  children: ReactNode
  className?: string
}

/** Panel corner radius (`rounded-xl` = var(--radius) + 4px) the end tabs must stay clear of. */
const PANEL_RADIUS = 10
/** Row inset: just clears the corners so the end tabs sit close to the container edges. */
const EDGE_PADDING = PANEL_RADIUS + 4
/** Smallest exposed strip of an overlapped tab; the row scrolls rather than compress past this. */
const MIN_TAB_VISIBLE = 24
/** How far a hovered tab slides out from under the selection to reveal itself. */
const HOVER_SLIDE = 12
/** The unselected fan overlap before any compression needed to fit the container. */
const baseOverlap = (count: number) => Math.min(16, 8 + count * 2)

/**
 * The signed x offset to slide a hovered tab out from under the selection, capped at
 * {@link HOVER_SLIDE} and clamped so its leading edge never crosses the panel's rounded corner.
 */
const hoverShift = (tab: HTMLElement, list: HTMLElement | null, index: number, selected: number) => {
  if (!list || index === selected) return 0
  const towardsLeft = index < selected
  const left = tab.offsetLeft - list.scrollLeft
  const room = towardsLeft
    ? left - PANEL_RADIUS
    : list.clientWidth - (left + tab.offsetWidth) - PANEL_RADIUS
  const slide = Math.min(HOVER_SLIDE, Math.max(0, room))
  return towardsLeft ? -slide : slide
}

/**
 * A tabbed container that turns each child `<Tab>` into an overlapping tab (labelled from
 * `items` or the tab's `title`); the selected tab sits in front and merges into the panel while
 * the rest fan behind it. The row widens its overlap to stay within the container on narrow
 * screens. Panels cross slide in the direction of travel while the container springs between
 * panel heights.
 *
 * @param items - Optional array of strings to use as tab labels, overriding child `title` props.
 * @param defaultIndex - The index of the tab to activate by default.
 * @param className - Optional CSS classes for custom container styling.
 */
export const Tabs = ({ items, defaultIndex = 0, className, children }: TabsProps) => {
  const { select, hoverTick } = useSoundEffects()
  const [activeIndex, setActiveIndex] = useState(defaultIndex)
  const [hover, setHover] = useState<{ index: number; shift: number } | null>(null)
  const [direction, setDirection] = useState(1)
  const [overlap, setOverlap] = useState(() => baseOverlap(2))
  const listRef = useRef<HTMLDivElement | null>(null)

  const validChildren = useMemo(
    () => Children.toArray(children).filter(isValidElement) as ReactElement<TabProps>[],
    [children],
  )

  const handleValueChange = useCallback(
    (val: string) => {
      select()
      const newIndex = parseInt(val, 10)
      setDirection(newIndex > activeIndex ? 1 : -1)
      setActiveIndex(newIndex)
    },
    [select, activeIndex],
  )

  const safeIndex = activeIndex >= 0 && activeIndex < validChildren.length ? activeIndex : 0
  const activeNode = validChildren[safeIndex]

  const [panelRef, panelHeight] = useMeasuredHeight<HTMLDivElement>([safeIndex])

  /**
   * Widen the overlap so the row fits its container, keeping the tabs from spilling outside it
   * on narrow screens. Tab widths are read with `offsetWidth`, which the overlap margins do not
   * affect, so a single pass settles without a feedback loop.
   */
  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const fit = () => {
      const tabs = Array.from(list.children) as HTMLElement[]
      if (tabs.length < 2) {
        setOverlap(0)
        return
      }
      /** Skip while hidden or not yet laid out (e.g. a nested tab panel); the observer reruns when shown. */
      if (!list.clientWidth) return
      const widths = tabs.map((tab) => tab.offsetWidth)
      const natural = widths.reduce((sum, width) => sum + width, 0)
      const available = list.clientWidth - 2 * EDGE_PADDING
      const needed = Math.ceil((natural - available) / (tabs.length - 1))
      const base = baseOverlap(tabs.length)
      /** Stop compressing once a tab would show less than a sliver; the row scrolls past that. */
      const max = Math.max(base, Math.min(...widths) - MIN_TAB_VISIBLE)
      setOverlap(Math.min(max, Math.max(base, needed)))
    }
    const observer = new ResizeObserver(fit)
    observer.observe(list)
    /** Observe the tabs too so the fit recomputes when a label reflows, e.g. a late font load. */
    for (const tab of Array.from(list.children)) observer.observe(tab)
    return () => observer.disconnect()
  }, [validChildren.length])

  return (
    <RadixTabs.Root
      value={safeIndex.toString()}
      onValueChange={handleValueChange}
      className={cn('relative isolate my-6 flex flex-col not-prose', className)}
    >
      <RadixTabs.List
        ref={listRef}
        aria-label="Tabs"
        className="relative flex items-end overflow-x-auto pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ paddingInline: EDGE_PADDING }}
      >
        {validChildren.map((child, i) => {
          const value = i.toString()
          const isSelected = safeIndex === i
          const isHovered = hover?.index === i
          const label = items?.[i] ?? child.props.title ?? `Tab ${i + 1}`

          /**
           * Unselected tabs fan out behind the panel (closer to the selection sits higher) and
           * tuck behind it, so the panel border reads between them and the content; the selected
           * tab sits in front so its open base merges into the panel.
           */
          const distance = Math.abs(i - safeIndex)
          const zIndex = isSelected ? 300 : isHovered ? 150 : 100 - distance

          /** The hovered tab slides out from under the selection by its clamped, measured offset. */
          const xShift = isHovered ? hover.shift : 0

          /**
           * A symmetric side shadow that fades toward the back of the fan. The z-order means it
           * only shows on the edge where a tab sits on top of its neighbour, so the stacking
           * order (selected on top, then each tab outward) reads clearly. Negative spread equal to
           * the blur keeps it horizontal so it never bleeds onto the merge seam.
           */
          const shadowAlpha = Math.max(0.1, 0.38 - distance * 0.1)
          const boxShadow = `4px 0 3px -3px rgba(0,0,0,${shadowAlpha}), -4px 0 3px -3px rgba(0,0,0,${shadowAlpha})`

          return (
            <RadixTabs.Trigger key={value} value={value} asChild>
              <m.button
                type="button"
                onMouseEnter={(event) => {
                  hoverTick()
                  setHover({ index: i, shift: hoverShift(event.currentTarget, listRef.current, i, safeIndex) })
                }}
                onMouseLeave={() => setHover(null)}
                style={{ zIndex, marginLeft: i === 0 ? 0 : -overlap, boxShadow }}
                animate={{ x: xShift }}
                transition={SMOOTH_SPRING_TRANSITION}
                className={cn(
                  'relative flex shrink-0 items-center justify-center whitespace-nowrap rounded-t-lg border border-b-0 border-border/60 px-5 pt-1.5 pb-2 font-mono text-xs font-medium lowercase transition-[color,background-color,box-shadow] duration-300',
                  isSelected
                    ? 'bg-code-tab text-primary'
                    : 'bg-code-tab-bar text-muted-foreground hover:text-foreground',
                )}
              >
                {/* Scale only the label on press so the tab body stays anchored. */}
                <m.span
                  whileTap={{ scale: 0.97 }}
                  transition={SPRING_TRANSITION}
                  className="relative z-10"
                >
                  {label}
                </m.span>
              </m.button>
            </RadixTabs.Trigger>
          )
        })}
      </RadixTabs.List>
      <m.div
        animate={{ height: panelHeight }}
        transition={SWIPE_TRANSITION}
        className="relative z-[200] -mt-px overflow-hidden rounded-xl border border-border/60 bg-code-tab shadow-t-sm"
      >
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          <RadixTabs.Content key={safeIndex} value={safeIndex.toString()} asChild forceMount>
            <m.div
              ref={panelRef}
              custom={direction}
              variants={SWIPE_VARIANTS}
              initial="enter"
              animate="center"
              exit="exit"
              transition={SWIPE_TRANSITION}
              className={cn(
                'w-full p-2 focus:outline-none flex flex-col gap-1.5 [&>*]:!my-0 [&>[role=paragraph]]:px-2 [&>p]:px-2 [&>ul]:px-2 [&>ol]:px-2 [&>h1]:px-2 [&>h2]:px-2 [&>h3]:px-2',
                activeNode?.props.className,
              )}
            >
              <TabPanelContext.Provider value={true}>{activeNode}</TabPanelContext.Provider>
            </m.div>
          </RadixTabs.Content>
        </AnimatePresence>
      </m.div>
    </RadixTabs.Root>
  )
}

/**
 * Individual tab content wrapper. Should only be used as a direct child of `<Tabs>`.
 * The component itself is a simple passthrough, as the actual rendering logic
 * is handled by the parent `<Tabs>` component mapping over its children.
 *
 * @param title - The label to display on the tab trigger button.
 * @param className - Optional CSS classes passed down to the animated tab panel container.
 */
export const Tab = ({ children }: TabProps) => <>{children}</>
