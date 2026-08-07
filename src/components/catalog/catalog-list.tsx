'use client'

import { AnimatePresence, m } from 'framer-motion'
import { useMemo } from 'react'
import { CategoryFilter } from '@/components/common/category-filter'
import { EmptyState } from '@/components/common/empty-state'
import { AnimatedListItem } from '@/components/ui/animated-list-item'
import { CATALOG_CATEGORIES } from '@/constants/categories'
import { catalog } from '@/data/static/catalog'
import { useCategoryParam } from '@/hooks/use-category-param'
import { usePageArriving } from '@/hooks/use-page-arrival'

/** Everything read, watched and played, filtered by medium */
export function CatalogList() {
  const isArriving = usePageArriving()
  const [activeCategory, handleCategoryChange] = useCategoryParam(CATALOG_CATEGORIES)

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
          <m.div
            key="catalog-grid"
            layout={!isArriving ? 'position' : false}
            className="flex flex-col"
          >
            {filteredItems.map((item) => (
              <AnimatedListItem
                key={`${item.category}-${item.title}`}
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
              </AnimatedListItem>
            ))}
          </m.div>
        ) : (
          <EmptyState key="empty" message="no entries found in this category." />
        )}
      </AnimatePresence>
    </div>
  )
}
