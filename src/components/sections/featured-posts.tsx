'use client'

import { useRef, useMemo, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { m, AnimatePresence } from 'framer-motion'
import { ViewAll } from '@/components/ui/view-all'
import { HoverHighlight } from '@/components/ui/hover-highlight'
import { BlogPostCard } from '@/components/blogs/blog-post-card'
import { useViews } from '@/components/providers/views-context'
import { landingPageContent } from '@/data/content/landing-content'
import { SectionTitle } from '@/components/layout/section-title'
import { EmptyState } from '@/components/common/empty-state'
import { SPRING_TRANSITION } from '@/constants/ui'
import type { BlogPost, BlogCategory } from '@/types/blog'

/** Props for {@link FeaturedPosts}. */
interface FeaturedPostsProps {
  filterType?: BlogCategory
  searchQuery?: string
  posts: BlogPost[]
}

const { featuredPosts } = landingPageContent.sections

/**
 * Featured Posts Section.
 * A dual purpose component that renders a subset of blog posts on the home page.
 * or acts as the fully searchable/filterable list on the main `/blogs` listing.
 */
export function FeaturedPosts({ filterType, searchQuery, posts }: FeaturedPostsProps) {
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  const { prefetchViews } = useViews()
  const listRef = useRef<HTMLDivElement>(null)

  const displayed = useMemo(() => {
    let filtered = posts

    const isFiltering = filterType && filterType !== 'all'
    if (isFiltering) {
      filtered = filtered.filter((p) =>
        filterType === 'technical' ? p.type !== 'personal' : p.type === 'personal',
      )
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
              <m.div
                key={post.slug}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={SPRING_TRANSITION}
              >
                <BlogPostCard post={post} />
              </m.div>
            ))}
          </m.div>
        ) : (
          <EmptyState key="no-posts" message="no posts found." />
        )}
      </AnimatePresence>

      {isHomePage && <ViewAll href="/blogs" label={featuredPosts.viewAll} />}
    </section>
  )
}
