'use client'

import { CategoryFilter } from '@/components/common/category-filter'
import { SearchBar, type SortOption } from '@/components/ui/search-bar'

export type { SortOption }

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

/** The search field and sort control above a filtered list */
export function ContentFilter<T extends string>({
  searchQuery,
  onSearchChange,
  category,
  onCategoryChange,
  categories,
  sortBy,
  onSortChange,
  placeholder,
}: ContentFilterProps<T>) {
  return (
    <div className="space-y-8">
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        sortBy={sortBy}
        onSortChange={onSortChange}
        placeholder={placeholder}
      />

      <CategoryFilter
        categories={categories}
        value={category}
        onChange={(val) => onCategoryChange(val as T)}
      />
    </div>
  )
}
