'use client'

import { useId } from 'react'
import { m } from 'framer-motion'
import { cn } from '@/utils/utils'
import { SPRING_TRANSITION, SMOOTH_SPRING_TRANSITION } from '@/constants/ui'

interface CategoryFilterProps<T extends string> {
  categories: readonly { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
}

/**
 * Used for filtering content by distinct categories (e.g., Blog topics, Component types).
 *
 * @param categories - Array of category objects containing a strictly typed `value` and display `label`.
 * @param value - The currently active category value.
 * @param onChange - Callback fired when a category is selected.
 */
export function CategoryFilter<T extends string>({
  categories,
  value,
  onChange,
}: CategoryFilterProps<T>) {
  const id = useId()

  return (
    <div className="flex flex-wrap items-center gap-x-1 gap-y-2">
      {categories.map(({ value: catValue, label }) => {
        const isActive = value === catValue

        return (
          <m.button
            key={catValue}
            type="button"
            whileTap={{ scale: 0.97 }}
            transition={SPRING_TRANSITION}
            onClick={() => onChange(catValue)}
            className={cn(
              'relative flex min-w-12 items-center justify-center rounded-none px-3 py-1 font-mono text-sm font-medium lowercase transition-colors duration-300',
              isActive ? 'text-primary-foreground' : 'text-secondary hover:text-primary',
            )}
          >
            <span className="relative z-10">{label}</span>
            {isActive && (
              <m.div
                layoutId={`active-tab-${id}`}
                className="absolute inset-0 rounded-none bg-primary"
                transition={SMOOTH_SPRING_TRANSITION}
              />
            )}
          </m.button>
        )
      })}
    </div>
  )
}
