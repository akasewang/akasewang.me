'use client'

import { SectionTitle } from '@/components/layout/section-title'
import { ExpandableList } from '@/components/ui/expandable-list'
import { TimelineItem } from '@/components/ui/timeline-item'
import { PRESENT } from '@/constants/constants'
import { landingPageContent } from '@/data/content/landing-content'
import { technicalTraining } from '@/data/static/technical-training'
import type { TimelineItemProps } from '@/types/site'

const renderTraining = (training: TimelineItemProps) => (
  <TimelineItem key={training.id} {...training} endDate={training.endDate || PRESENT} />
)

/** Technical learning programs, displayed directly after professional experience. */
export function TechnicalTraining() {
  return (
    <section id="technical-training" className="space-y-6">
      <SectionTitle>{landingPageContent.sections.technicalTraining}</SectionTitle>
      <ExpandableList items={technicalTraining} renderItem={renderTraining} />
    </section>
  )
}
