import type { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { TestimonialsGrid } from '@/components/testimonials/testimonials-grid'
import { SITE_URL } from '@/constants/constants'
import { testimonialsSeoContent } from '@/data/content/seo-content'
import { testimonialsPageContent } from '@/data/content/testimonials-content'
import { getBreadcrumbSchema } from '@/lib/json-ld'
import { constructMetadata, getOgImageUrl } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  return constructMetadata({
    title: testimonialsSeoContent.title,
    description: testimonialsSeoContent.description,
    path: '/testimonials',
    image: getOgImageUrl(testimonialsSeoContent.ogTitle, 'Testimonials'),
    imageAlt: testimonialsSeoContent.imageAlt,
  })
}

export default function TestimonialsPage() {
  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: 'Home', url: SITE_URL },
    { name: 'Testimonials', url: `${SITE_URL}/testimonials` },
  ])

  return (
    <PageLayout
      title={testimonialsPageContent.title}
      subtitle={testimonialsPageContent.subtitle}
      footerText="Kind words from people who (mostly) like me."
      breadcrumb={breadcrumbJsonLd}
      className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-hidden px-8 md:px-28"
    >
      <TestimonialsGrid />
    </PageLayout>
  )
}
