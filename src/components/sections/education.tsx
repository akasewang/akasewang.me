'use client'

import { SectionTitle } from '@/components/layout/section-title'
import { ExpandableList } from '@/components/ui/expandable-list'
import { TimelineItem } from '@/components/ui/timeline-item'
import { PRESENT } from '@/constants/constants'
import { landingPageContent } from '@/data/content/landing-content'
import { education } from '@/data/static/education'
import type { TimelineItemProps } from '@/types/site'

const renderEducation = (edu: TimelineItemProps) => (
  <TimelineItem key={edu.id} {...edu} endDate={edu.endDate || PRESENT} />
)

/** Schools and degrees, as a timeline on the landing page */
export function Education() {
  return (
    <section id="education" className="space-y-6">
      <SectionTitle>{landingPageContent.sections.education}</SectionTitle>
      <ExpandableList items={education} renderItem={renderEducation} />
    </section>
  )
}
