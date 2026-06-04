'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { ContentFilter, type SortOption } from '@/components/common/content-filter'
import { FeaturedProjects } from '@/components/sections/featured-projects'
import { PROJECT_CATEGORIES } from '@/constants/categories'
import { useViews } from '@/components/providers/views-context'
import type { ProjectPostData, ProjectCategory } from '@/types/project'

/**
 * Project Tabs/Filter Controller Component.
 * Acts as the client-side state manager for the main projects listing page.
 * Synchronizes search queries, category filters, and sorting methods with the URL search parameters
 * to ensure deep-linkable and shareable filter states.
 */
export function ProjectTabs({ projects }: { projects: ProjectPostData[] }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const { getViews, prefetchViews } = useViews()

  const categoryParam = searchParams.get('category')
  const [category, setCategory] = useState<ProjectCategory>(
    PROJECT_CATEGORIES.some((c) => c.value === categoryParam)
      ? (categoryParam as ProjectCategory)
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
    const isValidCategory =
      categoryParam && PROJECT_CATEGORIES.some((c) => c.value === categoryParam)
    setCategory(isValidCategory ? (categoryParam as ProjectCategory) : 'all')
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
    prefetchViews(projects.map((p) => p.slug))
  }, [projects, prefetchViews])

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

  const handleCategoryChange = (val: ProjectCategory) => {
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

  const sortedProjects = useMemo(() => {
    let result = [...projects]

    if (sortBy === 'date-asc') {
      result.reverse()
    } else if (sortBy === 'views-desc') {
      result.sort((a, b) => (getViews(b.slug) || 0) - (getViews(a.slug) || 0))
    } else if (sortBy === 'views-asc') {
      result.sort((a, b) => (getViews(a.slug) || 0) - (getViews(b.slug) || 0))
    }

    return result
  }, [projects, sortBy, getViews])

  return (
    <div className="w-full space-y-6">
      <ContentFilter
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        category={category}
        onCategoryChange={handleCategoryChange}
        categories={PROJECT_CATEGORIES}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        placeholder="search projects..."
      />
      <FeaturedProjects filterType={category} projects={sortedProjects} searchQuery={searchQuery} />
    </div>
  )
}
