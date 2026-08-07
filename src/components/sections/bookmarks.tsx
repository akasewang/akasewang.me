'use client'

import { SectionTitle } from '@/components/layout/section-title'
import { ExpandableList } from '@/components/ui/expandable-list'
import { TimelineItem } from '@/components/ui/timeline-item'
import { landingPageContent } from '@/data/content/landing-content'
import { bookmarks } from '@/data/static/bookmark'
import type { TimelineItemProps } from '@/types/site'

const renderBookmark = (bookmark: TimelineItemProps) => (
  <TimelineItem key={bookmark.id} {...bookmark} />
)

/** Writing and talks worth keeping, as a timeline on the landing page */
export function Bookmarks() {
  return (
    <section id="bookmarks" className="space-y-6">
      <SectionTitle>{landingPageContent.sections.bookmarks}</SectionTitle>
      <ExpandableList items={bookmarks} renderItem={renderBookmark} />
    </section>
  )
}
