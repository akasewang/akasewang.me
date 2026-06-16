'use client'

import { SectionTitle } from '@/components/layout/section-title'
import { ExpandableList } from '@/components/ui/expandable-list'
import { TimelineItem } from '@/components/ui/timeline-item'
import { PRESENT } from '@/constants/constants'
import { landingPageContent } from '@/data/content/landing-content'
import { certifications } from '@/data/static/certification'
import type { TimelineItemProps } from '@/types/site'

const renderCertification = (cert: TimelineItemProps) => (
  <TimelineItem key={cert.id} {...cert} endDate={cert.endDate || PRESENT} />
)

export function Certifications() {
  return (
    <section id="certifications" className="space-y-6 animate-page-simple">
      <SectionTitle>{landingPageContent.sections.certifications}</SectionTitle>
      <ExpandableList items={certifications} renderItem={renderCertification} />
    </section>
  )
}
