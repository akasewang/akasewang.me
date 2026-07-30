'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'

type CategoryOption<T extends string> = {
  readonly value: T
}

type CategoryOptions<T extends string> = readonly [CategoryOption<T>, ...CategoryOption<T>[]]

/**
 * Keeps a category filter in the URL. The first category is the default and is omitted from the
 * query string, while unknown values safely resolve back to that default.
 */
export function useCategoryParam<T extends string>(categories: CategoryOptions<T>) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const categoryParam = searchParams.get('category')
  const defaultCategory = categories[0].value

  const activeCategory = useMemo(
    () =>
      categoryParam && categories.some(({ value }) => value === categoryParam)
        ? (categoryParam as T)
        : defaultCategory,
    [categories, categoryParam, defaultCategory],
  )

  const setActiveCategory = useCallback(
    (category: T) => {
      const params = new URLSearchParams(searchParams.toString())

      if (category === defaultCategory) {
        params.delete('category')
      } else {
        params.set('category', category)
      }

      const query = params.toString()
      window.history.replaceState(null, '', query ? `${pathname}?${query}` : pathname)
    },
    [defaultCategory, pathname, searchParams],
  )

  return [activeCategory, setActiveCategory] as const
}
