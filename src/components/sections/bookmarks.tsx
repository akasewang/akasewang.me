'use client'

import { TimelineItem } from '@/components/ui/timeline-item'
import { ExpandableList } from '@/components/ui/expandable-list'
import { bookmarks } from '@/data/static/bookmark'
import { landingPageContent } from '@/data/content/landing-content'
import { SectionTitle } from '@/components/layout/section-title'
import type { TimelineItemProps } from '@/types/site'

const renderBookmark = (bookmark: TimelineItemProps) => (
  <TimelineItem key={bookmark.id} {...bookmark} />
)

/**
 * Bookmarks Section.
 * Renders a timeline of notable online features, interviews, or publications.
 */
export function Bookmarks() {
  return (
    <section id="bookmarks" className="space-y-6 animate-page-simple">
      <SectionTitle>{landingPageContent.sections.bookmarks}</SectionTitle>
      <ExpandableList items={bookmarks} renderItem={renderBookmark} />
    </section>
  )
}
