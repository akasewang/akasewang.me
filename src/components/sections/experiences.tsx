'use client'

import { TimelineItem } from '@/components/ui/timeline-item'
import { ExpandableList } from '@/components/ui/expandable-list'
import { experiences } from '@/data/static/experience'
import { landingPageContent } from '@/data/content/landing-content'
import { PRESENT } from '@/constants/constants'
import { SectionTitle } from '@/components/layout/section-title'
import type { TimelineItemProps } from '@/types/site'

const renderExperience = (exp: TimelineItemProps) => (
  <TimelineItem key={exp.id} {...exp} endDate={exp.endDate || PRESENT} />
)

/**
 * Experience Section.
 * Renders the professional experience timeline using the `ExpandableList` component.
 * Automatically injects the "Present" constant for ongoing roles.
 */
export function Experience() {
  return (
    <section id="experience" className="space-y-6 animate-page-simple">
      <SectionTitle>{landingPageContent.sections.experience}</SectionTitle>
      <ExpandableList items={experiences} renderItem={renderExperience} />
    </section>
  )
}
