'use client'

import { SectionTitle } from '@/components/layout/section-title'
import { ExpandableList } from '@/components/ui/expandable-list'
import { TimelineItem } from '@/components/ui/timeline-item'
import { PRESENT } from '@/constants/constants'
import { landingPageContent } from '@/data/content/landing-content'
import { experiences } from '@/data/static/experience'
import type { TimelineItemProps } from '@/types/site'

const renderExperience = (exp: TimelineItemProps) => (
  <TimelineItem key={exp.id} {...exp} endDate={exp.endDate || PRESENT} />
)

/** Roles held, as a timeline on the landing page */
export function Experience() {
  return (
    <section id="experience" className="space-y-6">
      <SectionTitle>{landingPageContent.sections.experience}</SectionTitle>
      <ExpandableList items={experiences} renderItem={renderExperience} />
    </section>
  )
}
