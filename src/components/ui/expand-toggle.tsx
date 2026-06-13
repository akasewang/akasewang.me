'use client'

import { m } from 'framer-motion'
import { Icons } from '@/components/ui/icons'
import { cn } from '@/utils/utils'

/** Props for {@link ExpandToggle}. */
interface ExpandToggleProps {
  isExpanded: boolean
  className?: string
}

const FLUID_SPRING = { type: 'spring', bounce: 0, duration: 0.4 } as const

/**
 * A purely visual expand/collapse chevron indicator driven by `isExpanded`. Controlled, it
 * manages no state or click handlers of its own.
 *
 * @param isExpanded - The external state controlling whether the toggle shows as open or closed.
 * @param className - Optional CSS classes for custom sizing or positioning.
 */
export function ExpandToggle({ isExpanded, className }: ExpandToggleProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('relative flex size-4 items-center justify-center', className)}
    >
      <m.div
        initial={false}
        animate={{ y: isExpanded ? 3 : -3 }}
        transition={FLUID_SPRING}
        className="absolute flex items-center justify-center"
      >
        <Icons.chevronUp className="size-3.5 stroke-[2.5]" />
      </m.div>

      <m.div
        initial={false}
        animate={{ y: isExpanded ? -3 : 3 }}
        transition={FLUID_SPRING}
        className="absolute flex items-center justify-center"
      >
        <Icons.chevronDown className="size-3.5 stroke-[2.5]" />
      </m.div>
    </div>
  )
}
