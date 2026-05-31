'use client'

import { TimelineItem } from '@/components/ui/timeline-item'
import { ExpandableList } from '@/components/ui/expandable-list'
import { education } from '@/data/static/education'
import { landingPageContent } from '@/data/content/landing-content'
import { PRESENT } from '@/constants/constants'
import { SectionTitle } from '@/components/layout/section-title'
import type { TimelineItemProps } from '@/types/site'

const renderEducation = (edu: TimelineItemProps) => (
  <TimelineItem key={edu.id} {...edu} endDate={edu.endDate || PRESENT} />
)

/**
 * Education Section.
 * Renders the academic background timeline using the `ExpandableList` component.
 * Automatically injects the "Present" constant for ongoing studies.
 */
export function Education() {
  return (
    <section id="education" className="space-y-6 animate-page-simple">
      <SectionTitle>{landingPageContent.sections.education}</SectionTitle>
      <ExpandableList items={education} renderItem={renderEducation} />
    </section>
  )
}
