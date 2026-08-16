import type { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { TESTIMONIALS_PAGE_CLASS } from '@/components/skeletons/testimonial-card'
import { TestimonialsGrid } from '@/components/testimonials/testimonials-grid'
import { SITE_URL } from '@/constants/constants'
import { testimonialsSeoContent } from '@/data/content/seo-content'
import { testimonialsPageContent } from '@/data/content/testimonials-content'
import { getBreadcrumbSchema } from '@/lib/json-ld'
import { constructMetadata, getOgImageUrl } from '@/lib/metadata'

export const metadata: Metadata = constructMetadata({
  title: testimonialsSeoContent.title,
  description: testimonialsSeoContent.description,
  path: '/testimonials',
  image: getOgImageUrl(testimonialsSeoContent.ogTitle, 'Testimonials'),
  imageAlt: testimonialsSeoContent.imageAlt,
})

/** every testimonial in one grid */
export default function TestimonialsPage() {
  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: 'Home', url: SITE_URL },
    { name: 'Testimonials', url: `${SITE_URL}/testimonials` },
  ])

  return (
    <PageLayout
      title={testimonialsPageContent.title}
      subtitle={testimonialsPageContent.subtitle}
      footerText={testimonialsPageContent.footerText}
      breadcrumb={breadcrumbJsonLd}
      className={TESTIMONIALS_PAGE_CLASS}
    >
      <TestimonialsGrid />
    </PageLayout>
  )
}
