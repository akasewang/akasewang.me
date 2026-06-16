'use client'

import { useRouter } from 'next/navigation'
import { ContentFilter } from '@/components/common/content-filter'
import { FeaturedPosts } from '@/components/sections/featured-posts'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { BLOG_CATEGORIES } from '@/constants/categories'
import { useContentListState } from '@/hooks/use-content-list-state'
import type { BlogPost } from '@/types/blog'

export function BlogTabs({ allPosts }: { allPosts: BlogPost[] }) {
  const router = useRouter()
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
