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
import { canUseHoverPointer } from '@/utils/pointer'
import { cn } from '@/utils/utils'
import { TabPanelContext } from './contexts/tab-panel-context'

interface TabsProps {
  items?: string[]
  defaultIndex?: number
  className?: string
  children: ReactNode
}

interface TabProps {
  title?: string
  children: ReactNode
  className?: string
}

interface TabInteraction {
  index: number
  shift: number
  source: 'hover' | 'press'
}

const PANEL_RADIUS = 10

const EDGE_PADDING = PANEL_RADIUS + 4

const MIN_TAB_VISIBLE = 24

const HOVER_SLIDE = 12

const baseOverlap = (count: number) => Math.min(16, 8 + count * 2)

const hoverShift = (
  tab: HTMLElement,
  list: HTMLElement | null,
  index: number,
  selected: number,
) => {
  if (!list || index === selected) return 0
  const towardsLeft = index < selected
  const left = tab.offsetLeft - list.scrollLeft
  const room = towardsLeft
    ? left - PANEL_RADIUS
    : list.clientWidth - (left + tab.offsetWidth) - PANEL_RADIUS
  const slide = Math.min(HOVER_SLIDE, Math.max(0, room))
  return towardsLeft ? -slide : slide
}

export const Tabs = ({ items, defaultIndex = 0, className, children }: TabsProps) => {
  const { select, hoverTick } = useSoundEffects()
  const [activeIndex, setActiveIndex] = useState(defaultIndex)
  const [interaction, setInteraction] = useState<TabInteraction | null>(null)
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
      setInteraction((current) => (current?.index === newIndex ? null : current))
    },
    [select, activeIndex],
  )

  const safeIndex = activeIndex >= 0 && activeIndex < validChildren.length ? activeIndex : 0
  const activeNode = validChildren[safeIndex]

  const [panelRef, panelHeight] = useMeasuredHeight<HTMLDivElement>([safeIndex])

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const fit = () => {
      const tabs = Array.from(list.children) as HTMLElement[]
      if (tabs.length < 2) {
        setOverlap(0)
        return
      }

      if (!list.clientWidth) return
      const widths = tabs.map((tab) => tab.offsetWidth)
      const natural = widths.reduce((sum, width) => sum + width, 0)
      const available = list.clientWidth - 2 * EDGE_PADDING
      const needed = Math.ceil((natural - available) / (tabs.length - 1))
      const base = baseOverlap(tabs.length)

      const max = Math.max(base, Math.min(...widths) - MIN_TAB_VISIBLE)
      setOverlap(Math.min(max, Math.max(base, needed)))
    }
    const observer = new ResizeObserver(fit)
    observer.observe(list)

    for (const tab of Array.from(list.children)) observer.observe(tab)
    return () => observer.disconnect()
  }, [])

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
          const isInteracting = interaction?.index === i && !isSelected
          const label = items?.[i] ?? child.props.title ?? `Tab ${i + 1}`

          const distance = Math.abs(i - safeIndex)
          const zIndex = isSelected ? 300 : isInteracting ? 150 : 100 - distance

          const xShift = isInteracting ? interaction.shift : 0

          const shadowAlpha = Math.max(0.1, 0.38 - distance * 0.1)
          const boxShadow = `4px 0 3px -3px rgba(0,0,0,${shadowAlpha}), -4px 0 3px -3px rgba(0,0,0,${shadowAlpha})`

          return (
            <RadixTabs.Trigger key={value} value={value} asChild>
              <m.button
                type="button"
                onPointerEnter={(event) => {
                  if (!canUseHoverPointer(event.pointerType)) return

                  hoverTick()
                  setInteraction({
                    index: i,
                    shift: hoverShift(event.currentTarget, listRef.current, i, safeIndex),
                    source: 'hover',
                  })
                }}
                onPointerLeave={() => setInteraction(null)}
                onPointerDown={(event) => {
                  if (canUseHoverPointer(event.pointerType) || isSelected) return

                  setInteraction({
                    index: i,
                    shift: hoverShift(event.currentTarget, listRef.current, i, safeIndex),
                    source: 'press',
                  })
                }}
                onPointerUp={(event) => {
                  if (!canUseHoverPointer(event.pointerType)) setInteraction(null)
                }}
                onPointerCancel={() => setInteraction(null)}
                style={{ zIndex, marginLeft: i === 0 ? 0 : -overlap, boxShadow }}
                animate={{ x: xShift }}
                transition={
                  interaction?.source === 'press' ? SPRING_TRANSITION : SMOOTH_SPRING_TRANSITION
                }
                className={cn(
                  'relative flex shrink-0 items-center justify-center whitespace-nowrap rounded-t-lg border border-b-0 border-border/60 px-5 pt-1.5 pb-2 font-mono text-xs font-medium lowercase transition-[color,background-color,box-shadow] duration-300',
                  isSelected
                    ? 'bg-code-tab text-primary'
                    : 'bg-code-tab-bar text-muted-foreground supports-hover:hover:text-foreground active:text-foreground',
                )}
              >
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

export const Tab = ({ children }: TabProps) => <>{children}</>
