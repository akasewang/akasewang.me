'use client'

import { m } from 'framer-motion'
import { useId } from 'react'
import { SMOOTH_SPRING_TRANSITION, SPRING_TRANSITION } from '@/constants/ui'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import { cn } from '@/utils/utils'

/** Props for {@link CategoryFilter}. */
interface CategoryFilterProps<T extends string> {
  categories: readonly { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
}

/**
 * A horizontal row of category buttons with an animated active pill indicator, used to filter
 * content by distinct categories (e.g. blog topics, component types).
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
  const { select, hoverTick } = useSoundEffects()
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
            onClick={() => {
              if (isActive) return
              select()
              onChange(catValue)
            }}
            onMouseEnter={hoverTick}
            className={cn(
              'relative flex min-w-12 items-center justify-center rounded-none px-3 py-1 font-mono text-[13px] font-medium lowercase transition-colors duration-300',
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
