'use client'

import { TimelineItem } from '@/components/ui/timeline-item'
import { ExpandableList } from '@/components/ui/expandable-list'
import { achievements } from '@/data/static/achievement'
import { landingPageContent } from '@/data/content/landing-content'
import { SectionTitle } from '@/components/layout/section-title'
import type { TimelineItemProps } from '@/types/site'

const renderAchievement = (achievement: TimelineItemProps) => (
  <TimelineItem key={achievement.id} {...achievement} />
)

/**
 * Achievements Section.
 * Renders a timeline of notable awards or milestones using the `ExpandableList` component.
 */
export function Achievements() {
  return (
    <section id="achievements" className="space-y-6 animate-page-simple">
      <SectionTitle>{landingPageContent.sections.achievements}</SectionTitle>
      <ExpandableList items={achievements} renderItem={renderAchievement} />
    </section>
  )
}
