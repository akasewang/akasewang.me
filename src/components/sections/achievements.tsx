'use client'

import { SectionTitle } from '@/components/layout/section-title'
import { ExpandableList } from '@/components/ui/expandable-list'
import { TimelineItem } from '@/components/ui/timeline-item'
import { landingPageContent } from '@/data/content/landing-content'
import { achievements } from '@/data/static/achievement'
import type { TimelineItemProps } from '@/types/site'

const renderAchievement = (achievement: TimelineItemProps) => (
  <TimelineItem key={achievement.id} {...achievement} />
)

/** Awards and recognitions, as a timeline on the landing page */
export function Achievements() {
  return (
    <section id="achievements" className="space-y-6">
      <SectionTitle>{landingPageContent.sections.achievements}</SectionTitle>
      <ExpandableList items={achievements} renderItem={renderAchievement} />
    </section>
  )
}
