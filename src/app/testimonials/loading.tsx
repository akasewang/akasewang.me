import { PageLayout } from '@/components/layout/page-layout'
import {
  TESTIMONIAL_GRID_CLASS,
  TESTIMONIALS_PAGE_CLASS,
  TestimonialCardSkeleton,
} from '@/components/skeletons/testimonial-card'
import { testimonialsPageContent } from '@/data/content/testimonials-content'

const TESTIMONIAL_COUNT = 9

/** Shown while the testimonials page loads, laid out to match it so nothing shifts when the real content arrives */
export default function Loading() {
  return (
    <PageLayout
      title={testimonialsPageContent.title}
      subtitle={testimonialsPageContent.subtitle}
      footerText={testimonialsPageContent.footerText}
      className={TESTIMONIALS_PAGE_CLASS}
    >
      <div className={TESTIMONIAL_GRID_CLASS}>
        {Array.from({ length: TESTIMONIAL_COUNT }).map((_, index) => (
          <TestimonialCardSkeleton key={index} />
        ))}
      </div>
    </PageLayout>
  )
}
