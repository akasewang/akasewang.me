'use client'

import { ContentFilter } from '@/components/common/content-filter'
import { FeaturedPosts } from '@/components/sections/featured-posts'
import { BLOG_CATEGORIES } from '@/constants/categories'
import { useContentListState } from '@/hooks/use-content-list-state'
import type { BlogPost } from '@/types/blog'

/** The blogs listing with its category filter, search and sort */
export function BlogTabs({ allPosts }: { allPosts: BlogPost[] }) {
  const {
    category,
    searchQuery,
    sortBy,
    sortedItems: sortedPosts,
    handleCategoryChange,
    handleSearchChange,
    handleSortChange,
  } = useContentListState({ items: allPosts, categories: BLOG_CATEGORIES })

  return (
    <div className="space-y-6">
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
