import type { Metadata } from 'next'
import { NewsletterSubscription } from '@/components/common/newsletter-subscription'
import { PageLayout } from '@/components/layout/page-layout'
import { SITE_URL } from '@/constants/constants'
import { newsletterPageContent } from '@/data/content/newsletter-content'
import { newsletterSeoContent } from '@/data/content/seo-content'
import { getBreadcrumbSchema } from '@/lib/json-ld'
import { constructMetadata, getOgImageUrl } from '@/lib/metadata'

export const metadata: Metadata = constructMetadata({
  title: newsletterSeoContent.title,
  description: newsletterSeoContent.description,
  path: '/newsletter',
  image: getOgImageUrl(newsletterSeoContent.ogTitle, 'Newsletter'),
  imageAlt: newsletterSeoContent.imageAlt,
})

/** the newsletter signup page */
export default function NewsletterPage() {
  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: 'Home', url: SITE_URL },
    { name: 'Newsletter', url: `${SITE_URL}/newsletter` },
  ])

  return (
    <PageLayout
      title={newsletterPageContent.title}
      subtitle={newsletterPageContent.subtitle}
      footerText="If you've made it this far, you deserve a coffee. Or a nap."
      breadcrumb={breadcrumbJsonLd}
    >
      <NewsletterSubscription hideHeader={true} />
    </PageLayout>
  )
}
