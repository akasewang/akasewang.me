'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo } from 'react'
import type { SortOption } from '@/components/common/content-filter'
import { useViews } from '@/components/providers/views-context'

const DEFAULT_SORT: SortOption = 'date-desc'
const SORT_OPTIONS = ['date-desc', 'date-asc', 'views-desc', 'views-asc'] as const

interface CategoryOption<T extends string> {
  value: T
  label: string
}

interface SluggedContent {
  slug: string
}

interface UseContentListStateOptions<TItem extends SluggedContent, TCategory extends string> {
  items: TItem[]
  categories: readonly [CategoryOption<TCategory>, ...CategoryOption<TCategory>[]]
}

const isSortOption = (value: string | null): value is SortOption =>
  SORT_OPTIONS.includes(value as SortOption)

/**
 * Category, search and sort for the blog and project lists, held in the URL so a filtered view can
 * be shared or reloaded. Unknown or absent parameters fall back to the defaults, which keeps a hand
 * edited query string harmless.
 */
export function useContentListState<TItem extends SluggedContent, TCategory extends string>({
  items,
  categories,
}: UseContentListStateOptions<TItem, TCategory>) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { getViews, prefetchViews } = useViews()
  const defaultCategory = categories[0].value

  const resolveCategory = useCallback(
    (value: string | null) =>
      categories.some((category) => category.value === value)
        ? (value as TCategory)
        : defaultCategory,
    [categories, defaultCategory],
  )

  const categoryParam = searchParams.get('category')
  const searchQueryParam = searchParams.get('q') || ''
  const sortParam = searchParams.get('sort')

  const category = useMemo(() => resolveCategory(categoryParam), [categoryParam, resolveCategory])
  const searchQuery = searchQueryParam
  const sortBy = useMemo(() => (isSortOption(sortParam) ? sortParam : DEFAULT_SORT), [sortParam])

  useEffect(() => {
    prefetchViews(items.map((item) => item.slug))
  }, [items, prefetchViews])

  /**
   * Defaults are removed from the query rather than written out, so a plain list keeps a clean URL.
   * replaceState updates the address without a navigation, a history entry or a scroll jump.
   */
  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())

      Object.entries(updates).forEach(([key, value]) => {
        if (
          value === null ||
          value === defaultCategory ||
          (key === 'sort' && value === DEFAULT_SORT)
        ) {
          params.delete(key)
          return
        }

        params.set(key, value)
      })

      const query = params.toString()
      window.history.replaceState(null, '', query ? `${pathname}?${query}` : pathname)
    },
    [defaultCategory, pathname, searchParams],
  )

  const handleCategoryChange = useCallback(
    (value: TCategory) => {
      updateParams({ category: value })
    },
    [updateParams],
  )

  const handleSearchChange = useCallback(
    (value: string) => {
      updateParams({ q: value || null })
    },
    [updateParams],
  )

  const handleSortChange = useCallback(
    (value: SortOption) => {
      updateParams({ sort: value })
    },
    [updateParams],
  )

  /** Items arrive newest first, so the default needs no work and date-asc is just a reverse */
  const sortedItems = useMemo(() => {
    const result = [...items]

    if (sortBy === 'date-asc') {
      result.reverse()
    } else if (sortBy === 'views-desc') {
      result.sort((a, b) => (getViews(b.slug) || 0) - (getViews(a.slug) || 0))
    } else if (sortBy === 'views-asc') {
      result.sort((a, b) => (getViews(a.slug) || 0) - (getViews(b.slug) || 0))
    }

    return result
  }, [getViews, items, sortBy])

  return {
    category,
    searchQuery,
    sortBy,
    sortedItems,
    handleCategoryChange,
    handleSearchChange,
    handleSortChange,
  }
}
