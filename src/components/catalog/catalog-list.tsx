'use client'

import { useCallback, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { m, AnimatePresence } from 'framer-motion'
import { CategoryFilter } from '@/components/common/category-filter'
import { EmptyState } from '@/components/common/empty-state'
import { CATALOG_CATEGORIES } from '@/constants/categories'
import { catalog } from '@/data/static/catalog'
import { SPRING_TRANSITION } from '@/constants/ui'
import type { FilterCategory } from '@/types/catalog'

/**
 * Catalog List Component.
 * The primary interface for the bookmarks/reading list page.
 * Manages category state via URL search parameters, allowing deep-linking to specific filters.
 */
export function CatalogList() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const categoryParam = searchParams.get('category')

  const activeCategory = useMemo(() => {
    const isValid = categoryParam && CATALOG_CATEGORIES.some((c) => c.value === categoryParam)
    return (isValid ? categoryParam : 'All') as FilterCategory
  }, [categoryParam])

  const handleCategoryChange = useCallback(
    (val: string) => {
      const params = new URLSearchParams(searchParams)
      if (val === 'All') {
        params.delete('category')
      } else {
        params.set('category', val)
      }
      router.replace(`/catalog?${params.toString()}`, { scroll: false })
    },
    [searchParams, router],
  )

  const filteredItems = useMemo(
    () =>
      activeCategory === 'All'
        ? catalog
        : catalog.filter((item) => item.category === activeCategory),
    [activeCategory],
  )

  return (
    <div className="space-y-8">
      <CategoryFilter
        categories={CATALOG_CATEGORIES}
        value={activeCategory}
        onChange={handleCategoryChange}
      />
      <AnimatePresence mode="popLayout">
        {filteredItems.length > 0 ? (
          <m.div key="catalog-grid" layout className="flex flex-col">
            {filteredItems.map((item) => (
              <m.div
                key={`${item.category}-${item.title}`}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={SPRING_TRANSITION}
                className="flex items-baseline justify-between gap-4 border-b border-border py-3 font-mono font-medium last:border-0"
              >
                <h3 className="line-clamp-2 flex-1 text-balance text-sm font-normal text-foreground">
                  {item.title}
                </h3>
                {item.author && (
                  <span className="line-clamp-2 max-w-[45%] shrink-0 text-right text-sm text-muted-foreground">
                    {item.author}
                  </span>
                )}
              </m.div>
            ))}
          </m.div>
        ) : (
          <EmptyState key="empty" message="no entries found in this category." />
        )}
      </AnimatePresence>
    </div>
  )
}
