'use client'

import { AnimatePresence, m } from 'framer-motion'
import { Icons } from '@/components/ui/icons'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SPRING_TRANSITION } from '@/constants/ui'
import { useSoundEffects } from '@/hooks/use-sound-effects'

export type SortOption = 'date-desc' | 'date-asc' | 'views-desc' | 'views-asc'

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'date-desc', label: 'Newest First' },
  { value: 'date-asc', label: 'Oldest First' },
  { value: 'views-desc', label: 'Most Viewed' },
  { value: 'views-asc', label: 'Least Viewed' },
]

interface SearchBarProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  sortBy: SortOption
  onSortChange: (value: SortOption) => void
  placeholder?: string
}

export function SearchBar({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  placeholder = 'search...',
}: SearchBarProps) {
  const { tap } = useSoundEffects()
  const hasQuery = searchQuery.length > 0

  return (
    <div className="group relative flex h-9 items-center gap-3">
      <Icons.search className="size-4 shrink-0 text-muted-foreground/50 transition-colors duration-300 group-has-[input:focus]:text-secondary group-has-[[data-popup-open]]:text-secondary" />

      <input
        type="text"
        value={searchQuery}
        placeholder={placeholder}
        aria-label="Search"
        onChange={(e) => onSearchChange(e.target.value)}
        className="min-w-0 flex-1 bg-transparent text-sm placeholder:text-muted-foreground/50 focus:outline-none"
      />

      <div className="flex shrink-0 items-center gap-1.5">
        <AnimatePresence initial={false}>
          {hasQuery && (
            <m.button
              type="button"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={SPRING_TRANSITION}
              whileTap={{ scale: 0.9 }}
              aria-label="Clear search"
              onClick={() => {
                tap()
                onSearchChange('')
              }}
              className="flex size-6 shrink-0 items-center justify-center text-muted-foreground/50 transition-colors duration-200 supports-hover:hover:text-primary active:text-primary"
            >
              <Icons.close className="size-4.5" />
            </m.button>
          )}
        </AnimatePresence>

        <Select
          items={SORT_OPTIONS}
          value={sortBy}
          onValueChange={(val) => onSortChange(val as SortOption)}
        >
          <SelectTrigger className="h-9 w-36 bg-transparent p-0 text-xs ring-0 retina:ring-0 active:scale-100 data-[popup-open]:scale-100">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end" sideOffset={10} className="shadow-md ring-ring/80">
            {SORT_OPTIONS.map(({ value, label }) => (
              <SelectItem key={value} value={value} className="py-1 pr-7 text-xs lowercase">
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <span className="absolute inset-x-0 bottom-0 h-px bg-border" aria-hidden="true" />
      <span
        className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-primary transition-transform duration-300 ease-out group-has-[input:focus]:scale-x-100 group-has-[[data-popup-open]]:scale-x-100"
        aria-hidden="true"
      />
    </div>
  )
}
