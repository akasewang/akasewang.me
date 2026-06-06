'use client'

import { TimelineItem } from '@/components/ui/timeline-item'
import { ExpandableList } from '@/components/ui/expandable-list'
import { volunteer } from '@/data/static/volunteer'
import { landingPageContent } from '@/data/content/landing-content'
import { PRESENT } from '@/constants/constants'
import { SectionTitle } from '@/components/layout/section-title'
import type { TimelineItemProps } from '@/types/site'

const renderVolunteer = (vol: TimelineItemProps) => (
  <TimelineItem key={vol.id} {...vol} endDate={vol.endDate || PRESENT} />
)

/**
 * Volunteer Section.
 * Renders a timeline of community service and open source contributions using the `ExpandableList` component.
 * Automatically injects the "Present" constant for ongoing roles.
 */
export function Volunteer() {
  return (
    <section id="volunteer" className="space-y-6 animate-page-simple">
      <SectionTitle>{landingPageContent.sections.volunteer}</SectionTitle>
      <ExpandableList items={volunteer} renderItem={renderVolunteer} />
    </section>
  )
}
