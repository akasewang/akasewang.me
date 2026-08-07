'use client'

import { ContentFilter } from '@/components/common/content-filter'
import { FeaturedProjects } from '@/components/sections/featured-projects'
import { PROJECT_CATEGORIES } from '@/constants/categories'
import { useContentListState } from '@/hooks/use-content-list-state'
import type { ProjectPostData } from '@/types/project'

/** The projects listing with its category filter, search and sort */
export function ProjectTabs({ projects }: { projects: ProjectPostData[] }) {
  const {
    category,
    searchQuery,
    sortBy,
    sortedItems: sortedProjects,
    handleCategoryChange,
    handleSearchChange,
    handleSortChange,
  } = useContentListState({ items: projects, categories: PROJECT_CATEGORIES })

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
