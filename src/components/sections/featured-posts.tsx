'use client'

import { AnimatePresence, m } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useRef } from 'react'
import { BlogPostCard } from '@/components/blogs/blog-post-card'
import { EmptyState } from '@/components/common/empty-state'
import { SectionTitle } from '@/components/layout/section-title'
import { useViews } from '@/components/providers/views-context'
import { AnimatedListItem } from '@/components/ui/animated-list-item'
import { HoverHighlight } from '@/components/ui/hover-highlight'
import { ViewAll } from '@/components/ui/view-all'
import { blogsListingContent } from '@/data/content/blogs-content'
import { landingPageContent } from '@/data/content/landing-content'
import type { BlogCategory, BlogPost } from '@/types/blog'

interface FeaturedPostsProps {
  filterType?: BlogCategory
  searchQuery?: string
  posts: BlogPost[]
}

const { featuredPosts } = landingPageContent.sections

const EMPTY_MESSAGES: Partial<Record<BlogCategory, string>> = {
  technical: blogsListingContent.noTechnical,
  personal: blogsListingContent.noPersonal,
  'short-notes': blogsListingContent.noShortNotes,
}

export function FeaturedPosts({ filterType, searchQuery, posts }: FeaturedPostsProps) {
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  const { prefetchViews } = useViews()
  const listRef = useRef<HTMLDivElement>(null)

  const displayed = useMemo(() => {
    let filtered = posts

    const isFiltering = filterType && filterType !== 'all'
    if (isFiltering) {
      filtered = filtered.filter((p) => {
        const postType = p.type || 'technical'
        return postType === filterType
      })
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (p) => p.title.toLowerCase().includes(query) || p.excerpt.toLowerCase().includes(query),
      )
    }

    return isHomePage ? filtered.slice(0, 3) : filtered
  }, [posts, filterType, searchQuery, isHomePage])

  useEffect(() => {
    if (displayed.length > 0) {
      prefetchViews(displayed.map((post) => post.slug))
    }
  }, [displayed, prefetchViews])

  return (
    <section id="posts" className="space-y-6 animate-page-simple">
      {isHomePage && <SectionTitle>{featuredPosts.title}</SectionTitle>}

      <AnimatePresence mode="popLayout">
        {displayed.length > 0 ? (
          <m.div key="post-list" ref={listRef} layout className="relative space-y-4">
            <HoverHighlight parentRef={listRef} />
            {displayed.map((post) => (
              <AnimatedListItem key={post.slug}>
                <BlogPostCard post={post} />
              </AnimatedListItem>
            ))}
          </m.div>
        ) : (
          <EmptyState
            key="no-posts"
            message={
              (!searchQuery && filterType && EMPTY_MESSAGES[filterType]) || 'no posts found.'
            }
          />
        )}
      </AnimatePresence>

      {isHomePage && <ViewAll href="/blogs" label={featuredPosts.viewAll} />}
    </section>
  )
}
