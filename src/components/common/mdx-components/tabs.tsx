'use client'

import {
  Children,
  isValidElement,
  useId,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react'
import * as RadixTabs from '@radix-ui/react-tabs'
import { m } from 'framer-motion'
import { cn } from '@/utils/utils'
import { SPRING_TRANSITION, SMOOTH_SPRING_TRANSITION } from '@/constants/ui'

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

/**
 * Maps child `<Tab>` components dynamically.
 *
 * @param items - Optional array of strings to use as tab labels, overriding child `title` props.
 * @param defaultIndex - The index of the tab to activate by default.
 * @param className - Optional CSS classes for custom container styling.
 */
export const Tabs = ({ items, defaultIndex = 0, className, children }: TabsProps) => {
  const id = useId()
  const tabs = useMemo(
    () =>
      (Children.toArray(children).filter(isValidElement) as ReactElement<TabProps>[]).map(
        (child, i) => ({
          label: items?.[i] ?? child.props.title ?? `Tab ${i + 1}`,
          value: `${id}-${i}`,
          node: child,
        }),
      ),
    [children, items, id],
  )
  const [activeTab, setActiveTab] = useState(tabs[defaultIndex]?.value ?? tabs[0]?.value)

  return (
    <RadixTabs.Root
      value={activeTab}
      onValueChange={setActiveTab}
      className={cn('relative isolate my-6 not-prose rounded-xl bg-code-tab', className)}
    >
      <RadixTabs.List
        aria-label="Tabs"
        className="flex items-center gap-1 overflow-x-auto px-2 pt-2 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {tabs.map(({ value, label }) => {
          const isActive = activeTab === value
          return (
            <RadixTabs.Trigger key={value} value={value} asChild>
              <m.button
                type="button"
                whileTap={{ scale: 0.97 }}
                transition={SPRING_TRANSITION}
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
      {tabs.map(({ value, node }) => (
        <RadixTabs.Content
          key={value}
          value={value}
          className="p-2 focus:outline-none flex flex-col gap-3 [&>*]:!my-0 [&>[role=paragraph]]:px-2 [&>p]:px-2 [&>ul]:px-2 [&>ol]:px-2 [&>h1]:px-2 [&>h2]:px-2 [&>h3]:px-2"
        >
          {node}
        </RadixTabs.Content>
      ))}
    </RadixTabs.Root>
  )
}

/**
 * Individual tab content wrapper. Should only be used as a direct child of `<Tabs>`.
 * The component itself is a simple passthrough, as the actual rendering logic
 * is handled by the parent `<Tabs>` component mapping over its children.
 *
 * @param title - The label to display on the tab trigger button.
 */
export const Tab = ({ children }: TabProps) => <>{children}</>
