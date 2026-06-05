'use client'

import { useState, useMemo, useEffect, useCallback, useDeferredValue, useRef } from 'react'
import { useSearchParams, usePathname } from 'next/navigation'
import { ContentFilter, type SortOption } from '@/components/common/content-filter'
import { RegistryList } from '@/components/registry/registry-list'
import { useViews } from '@/components/providers/views-context'
import { COMPONENT_CATEGORIES } from '@/constants/categories'
import type { RegistryItem } from '@/types/registry'

type ComponentCategory = (typeof COMPONENT_CATEGORIES)[number]['value']

/** Props for {@link ComponentTabs}. */
interface ComponentTabsProps {
  allComponents: RegistryItem[]
}

const VALID_SORTS = new Set<SortOption>(['date-desc', 'date-asc', 'views-desc', 'views-asc'])

/**
 * Main container for the component registry browser.
 * Handles URL-based state synchronization for searching and filtering by category.
 * and sorting registry items (by date or views).
 *
 * @param allComponents - The full array of registry items to be filtered and displayed.
 */
export function ComponentTabs({ allComponents }: ComponentTabsProps) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { getViews } = useViews()

  const categoryParam = searchParams.get('category')
  const searchQueryParam = searchParams.get('q') || ''
  const sortParam = searchParams.get('sort') as SortOption

  const [category, setCategory] = useState<ComponentCategory>(
    COMPONENT_CATEGORIES.some((c) => c.value === categoryParam)
      ? (categoryParam as ComponentCategory)
      : 'all',
  )
  const [searchQuery, setSearchQuery] = useState(searchQueryParam)
  const deferredQuery = useDeferredValue(searchQuery)
  const [sortBy, setSortBy] = useState<SortOption>(
    VALID_SORTS.has(sortParam) ? sortParam : 'date-desc',
  )

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setCategory(
      COMPONENT_CATEGORIES.some((c) => c.value === categoryParam)
        ? (categoryParam as ComponentCategory)
        : 'all',
    )
  }, [categoryParam])

  useEffect(() => {
    setSearchQuery(searchQueryParam)
  }, [searchQueryParam])

  useEffect(() => {
    if (VALID_SORTS.has(sortParam)) setSortBy(sortParam)
  }, [sortParam])

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([key, value]) => {
        if (!value || value === 'all' || (key === 'sort' && value === 'date-desc')) {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      })

      const query = params.toString()
      const newUrl = query ? `${pathname}?${query}` : pathname

      /** Shallow URL update that syncs with `useSearchParams` without triggering a navigation. */
      window.history.replaceState(null, '', newUrl)
    },
    [searchParams, pathname],
  )

  const debouncedUpdateParams = useCallback(
    (updates: Record<string, string | null>) => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = setTimeout(() => {
        updateParams(updates)
      }, 300)
    },
    [updateParams],
  )

  const filteredAndSortedComponents = useMemo(() => {
    const query = deferredQuery.toLowerCase()

    return allComponents
      .filter(
        (item) =>
          item.type === 'registry:component' &&
          (category === 'all' || item.category === category) &&
          (item.name.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query)),
      )
      .map((item) => ({
        item,
        time: new Date(item.date).getTime(),
        views: getViews(item.slug) || 0,
      }))
      .sort((a, b) => {
        if (sortBy === 'date-asc') return a.time - b.time
        if (sortBy === 'date-desc') return b.time - a.time
        if (sortBy === 'views-asc') return a.views - b.views
        if (sortBy === 'views-desc') return b.views - a.views
        return 0
      })
      .map(({ item }) => item)
  }, [allComponents, deferredQuery, category, sortBy, getViews])

  return (
    <div className="space-y-8">
      <ContentFilter
        searchQuery={searchQuery}
        onSearchChange={(val) => {
          setSearchQuery(val)
          debouncedUpdateParams({ q: val || null })
        }}
        category={category}
        onCategoryChange={(val) => {
          setCategory(val)
          updateParams({ category: val })
        }}
        categories={COMPONENT_CATEGORIES as any}
        sortBy={sortBy}
        onSortChange={(val) => {
          setSortBy(val)
          updateParams({ sort: val })
        }}
        placeholder="search components..."
      />
      <RegistryList components={filteredAndSortedComponents} />
    </div>
  )
}
