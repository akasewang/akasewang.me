'use client'

import { SectionTitle } from '@/components/layout/section-title'
import { ExpandableList } from '@/components/ui/expandable-list'
import { TimelineItem } from '@/components/ui/timeline-item'
import { PRESENT } from '@/constants/constants'
import { landingPageContent } from '@/data/content/landing-content'
import { volunteer } from '@/data/static/volunteer'
import type { TimelineItemProps } from '@/types/site'

const renderVolunteer = (vol: TimelineItemProps) => (
  <TimelineItem key={vol.id} {...vol} endDate={vol.endDate || PRESENT} />
)

export function Volunteer() {
  return (
    <section id="volunteer" className="space-y-6 animate-page-simple">
      <SectionTitle>{landingPageContent.sections.volunteer}</SectionTitle>
      <ExpandableList items={volunteer} renderItem={renderVolunteer} />
    </section>
  )
}
