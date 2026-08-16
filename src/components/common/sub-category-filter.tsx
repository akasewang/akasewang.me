'use client'

import { m } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useId, useState } from 'react'
import { SMOOTH_SPRING_TRANSITION, SPRING_TRANSITION } from '@/constants/ui'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import { cn } from '@/utils/utils'

interface SubCategoryFilterProps<T extends string> {
  categories: readonly { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
  className?: string
}

/**
 * The row of chips for a choice made under one already taken further up the page.
 *
 * The same control as CategoryFilter and deliberately the same movement, so the two read as one
 * family. Quieter, though: smaller type and a muted block in place of the solid one, since a filter
 * nested beneath another should not compete with it for the eye.
 *
 * It only picks. Moving what sits beneath it is CategoryTransition's job, which a caller wraps that
 * content in or leaves out.
 */
export function SubCategoryFilter<T extends string>({
  categories,
  value,
  onChange,
  className,
}: SubCategoryFilterProps<T>) {
  const { select, hoverTick } = useSoundEffects()
  /**
   * The sliding block is shared by whichever chips carry the same layout id. Keying it to the route
   * as well as the instance stops the filter on an arriving page from animating its block across
   * from the page being left, which are two different rows that happen to look alike.
   */
  const reactId = useId()
  const pathname = usePathname()
  const [id] = useState(() => `${reactId}-${pathname}`)

  return (
    <div className={cn('flex flex-wrap items-center gap-x-1 gap-y-1.5', className)}>
      {categories.map(({ value: catValue, label }) => {
        const isActive = value === catValue

        return (
          <m.button
            key={catValue}
            type="button"
            whileTap={{ scale: 0.97 }}
            transition={SPRING_TRANSITION}
            onClick={() => {
              if (isActive) return
              select()
              onChange(catValue)
            }}
            onMouseEnter={hoverTick}
            className={cn(
              'relative flex items-center justify-center rounded-none px-2.5 py-1 font-mono text-xs font-medium lowercase transition-colors duration-300',
              isActive
                ? 'text-primary'
                : 'text-muted-foreground supports-hover:hover:text-primary active:text-primary',
            )}
          >
            <span className="relative z-10">{label}</span>
            {isActive && (
              <m.div
                layoutId={`active-sub-tab-${id}`}
                className="absolute inset-0 rounded-none bg-surface-50"
                transition={SMOOTH_SPRING_TRANSITION}
              />
            )}
          </m.button>
        )
      })}
    </div>
  )
}
