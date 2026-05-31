'use client'

import { TimelineItem } from '@/components/ui/timeline-item'
import { ExpandableList } from '@/components/ui/expandable-list'
import { certifications } from '@/data/static/certification'
import { landingPageContent } from '@/data/content/landing-content'
import { PRESENT } from '@/constants/constants'
import { SectionTitle } from '@/components/layout/section-title'
import type { TimelineItemProps } from '@/types/site'

const renderCertification = (cert: TimelineItemProps) => (
  <TimelineItem key={cert.id} {...cert} endDate={cert.endDate || PRESENT} />
)

/**
 * Certifications Section.
 * Renders a timeline of professional certifications using the `ExpandableList` component.
 * Automatically injects the "Present" constant for active credentials that do not expire.
 */
export function Certifications() {
  return (
    <section id="certifications" className="space-y-6 animate-page-simple">
      <SectionTitle>{landingPageContent.sections.certifications}</SectionTitle>
      <ExpandableList items={certifications} renderItem={renderCertification} />
    </section>
  )
}
