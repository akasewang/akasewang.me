'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { ContentFilter, type SortOption } from '@/components/common/content-filter'
import { FeaturedPosts } from '@/components/sections/featured-posts'
import { BLOG_CATEGORIES } from '@/constants/categories'
import { useViews } from '@/components/providers/views-context'
import type { BlogPost, BlogCategory as BlogCategoryType } from '@/types/blog'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'

/**
 * Blog Tabs/Filter Controller Component.
 * Acts as the client-side state manager for the main blog listing page.
 * Synchronizes search queries, category filters, and sorting methods with the URL search parameters
 * to ensure deep-linkable and shareable filter states.
 */
export function BlogTabs({ allPosts }: { allPosts: BlogPost[] }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const { getViews, prefetchViews } = useViews()

  const categoryParam = searchParams.get('category')
  const [category, setCategory] = useState<BlogCategoryType>(
    BLOG_CATEGORIES.some((c) => c.value === categoryParam)
      ? (categoryParam as BlogCategoryType)
      : 'all',
  )

  const searchQueryParam = searchParams.get('q') || ''
  const [searchQuery, setSearchQuery] = useState(searchQueryParam)

  const sortParam = searchParams.get('sort') as SortOption
  const [sortBy, setSortBy] = useState<SortOption>(
    ['date-desc', 'date-asc', 'views-desc', 'views-asc'].includes(sortParam)
      ? sortParam
      : 'date-desc',
  )

  useEffect(() => {
    const isValidCategory = categoryParam && BLOG_CATEGORIES.some((c) => c.value === categoryParam)
    setCategory(isValidCategory ? (categoryParam as BlogCategoryType) : 'all')
  }, [categoryParam])

  useEffect(() => {
    setSearchQuery(searchQueryParam)
  }, [searchQueryParam])

  useEffect(() => {
    if (['date-desc', 'date-asc', 'views-desc', 'views-asc'].includes(sortParam)) {
      setSortBy(sortParam)
    }
  }, [sortParam])

  useEffect(() => {
    prefetchViews(allPosts.map((p) => p.slug))
  }, [allPosts, prefetchViews])

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === 'all' || (key === 'sort' && value === 'date-desc')) {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      })

      const query = params.toString()
      const newUrl = query ? `${pathname}?${query}` : pathname

      router.replace(newUrl, { scroll: false })
    },
    [searchParams, router, pathname],
  )

  const handleCategoryChange = (val: BlogCategoryType) => {
    setCategory(val)
    updateParams({ category: val })
  }

  const handleSearchChange = (val: string) => {
    setSearchQuery(val)
    updateParams({ q: val || null })
  }

  const handleSortChange = (val: SortOption) => {
    setSortBy(val)
    updateParams({ sort: val })
  }

  const sortedPosts = useMemo(() => {
    let result = [...allPosts]

    if (sortBy === 'date-asc') {
      result.reverse()
    } else if (sortBy === 'views-desc') {
      result.sort((a, b) => (getViews(b.slug) || 0) - (getViews(a.slug) || 0))
    } else if (sortBy === 'views-asc') {
      result.sort((a, b) => (getViews(a.slug) || 0) - (getViews(b.slug) || 0))
    }

    return result
  }, [allPosts, sortBy, getViews])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          defaultText="join newsletter"
          defaultIcon={Icons.newsletter}
          onClick={() => router.push('/newsletter')}
        />
        <Button
          variant="minimal"
          defaultText="leave a message"
          defaultIcon={Icons.messageBoard}
          onClick={() => router.push('/message-board')}
        />
      </div>

      <ContentFilter
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        category={category}
        onCategoryChange={handleCategoryChange}
        categories={BLOG_CATEGORIES}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        placeholder="search posts..."
      />

      <FeaturedPosts posts={sortedPosts} filterType={category} searchQuery={searchQuery} />
    </div>
  )
}
