'use client'

import * as RadixTabs from '@radix-ui/react-tabs'
import { AnimatePresence, m } from 'framer-motion'
import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useCallback,
  useId,
  useMemo,
  useState,
} from 'react'
import {
  SMOOTH_SPRING_TRANSITION,
  SPRING_TRANSITION,
  SWIPE_TRANSITION,
  SWIPE_VARIANTS,
} from '@/constants/ui'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import { cn } from '@/utils/utils'

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

/**
 * A tabbed container that turns each child `<Tab>` into a tab (labelled from `items` or the
 * tab's `title`), with an animated active tab indicator.
 *
 * @param items - Optional array of strings to use as tab labels, overriding child `title` props.
 * @param defaultIndex - The index of the tab to activate by default.
 * @param className - Optional CSS classes for custom container styling.
 */
export const Tabs = ({ items, defaultIndex = 0, className, children }: TabsProps) => {
  const { select, hoverTick } = useSoundEffects()
  const id = useId()
  const [activeIndex, setActiveIndex] = useState(defaultIndex)
  const [direction, setDirection] = useState(1)

  const validChildren = useMemo(
    () => Children.toArray(children).filter(isValidElement) as ReactElement<TabProps>[],
    [children],
  )

  const handleValueChange = useCallback(
    (val: string) => {
      select()
      const newIndex = parseInt(val, 10)
      setActiveIndex((prev) => {
        setDirection(newIndex > prev ? 1 : -1)
        return newIndex
      })
    },
    [select],
  )

  const safeIndex = activeIndex < validChildren.length ? activeIndex : 0
  const activeNode = validChildren[safeIndex]

  return (
    <RadixTabs.Root
      value={safeIndex.toString()}
      onValueChange={handleValueChange}
      className={cn('relative isolate my-6 not-prose rounded-xl bg-code-tab', className)}
    >
      <RadixTabs.List
        aria-label="Tabs"
        className="flex items-center gap-1 overflow-x-auto px-2 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {validChildren.map((child, i) => {
          const value = i.toString()
          const isActive = safeIndex === i
          const label = items?.[i] ?? child.props.title ?? `Tab ${i + 1}`

          return (
            <RadixTabs.Trigger key={value} value={value} asChild>
              <m.button
                type="button"
                whileTap={{ scale: 0.97 }}
                transition={SPRING_TRANSITION}
                onMouseEnter={hoverTick}
                className={cn(
                  'group relative flex min-w-16 items-center justify-center rounded-lg px-3 py-1 font-mono text-xs font-medium lowercase transition-colors duration-300',
                  isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/80',
                )}
              >
                <span className="relative z-10">{label}</span>
                {isActive && (
                  <m.div
                    layoutId={`active-tab-${id}`}
                    className="absolute inset-0 z-0 rounded-lg bg-background"
                    transition={SMOOTH_SPRING_TRANSITION}
                  />
                )}
              </m.button>
            </RadixTabs.Trigger>
          )
        })}
      </RadixTabs.List>
      <div className="relative overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          <RadixTabs.Content key={safeIndex} value={safeIndex.toString()} asChild forceMount>
            <m.div
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
              {activeNode}
            </m.div>
          </RadixTabs.Content>
        </AnimatePresence>
      </div>
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
