'use client'

import { CategoryFilter } from '@/components/common/category-filter'
import { Icons } from '@/components/ui/icons'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export type SortOption = 'date-desc' | 'date-asc' | 'views-desc' | 'views-asc'

interface ContentFilterProps<T extends string> {
  searchQuery: string
  onSearchChange: (value: string) => void
  category: T
  onCategoryChange: (value: T) => void
  categories: readonly { value: T; label: string }[]
  sortBy: SortOption
  onSortChange: (value: SortOption) => void
  placeholder?: string
}

const SORT_OPTIONS: readonly { value: SortOption; label: string }[] = [
  { value: 'date-desc', label: 'Newest First' },
  { value: 'date-asc', label: 'Oldest First' },
  { value: 'views-desc', label: 'Most Viewed' },
  { value: 'views-asc', label: 'Least Viewed' },
]

/**
 * A composite filtering interface combining a text search input, a sort dropdown,
 * and a category selection filter. Commonly used in list pages like blogs or registries.
 *
 * @param searchQuery - The current text input value for searching.
 * @param onSearchChange - Callback fired when the search input changes.
 * @param category - The currently active category filter.
 * @param onCategoryChange - Callback fired when a new category is selected.
 * @param categories - Array of available category options.
 * @param sortBy - The currently active sorting option (e.g., date or views).
 * @param onSortChange - Callback fired when a new sort option is selected.
 * @param placeholder - Placeholder text for the search input.
 */
export function ContentFilter<T extends string>({
  searchQuery,
  onSearchChange,
  category,
  onCategoryChange,
  categories,
  sortBy,
  onSortChange,
  placeholder = 'search...',
}: ContentFilterProps<T>) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Icons.search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/50" />
          <Input
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={sortBy} onValueChange={(val) => onSortChange(val as SortOption)}>
          <SelectTrigger className="h-10 w-full shrink-0 text-xs lowercase sm:w-[170px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end" className="min-w-[150px]">
            {SORT_OPTIONS.map(({ value, label }) => (
              <SelectItem key={value} value={value} className="text-xs lowercase">
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <CategoryFilter
        categories={categories}
        value={category}
        onChange={(val) => onCategoryChange(val as T)}
      />
    </div>
  )
}
