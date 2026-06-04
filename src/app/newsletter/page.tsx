import { NewsletterSubscription } from '@/components/common/newsletter-subscription'
import { getBreadcrumbSchema } from '@/lib/json-ld'
import { SITE_URL } from '@/constants/constants'
import { Metadata } from 'next'
import { newsletterSeoContent } from '@/data/content/seo-content'
import { newsletterPageContent } from '@/data/content/newsletter-content'
import { constructMetadata, getOgImageUrl } from '@/lib/metadata'
import { PageLayout } from '@/components/layout/page-layout'

/** Statically generated metadata for the public Newsletter subscription page. */
export async function generateMetadata(): Promise<Metadata> {
  return constructMetadata({
    title: newsletterSeoContent.title,
    description: newsletterSeoContent.description,
    path: '/newsletter',
    image: getOgImageUrl(newsletterSeoContent.ogTitle, 'Newsletter'),
    imageAlt: newsletterSeoContent.imageAlt,
  })
}

/**
 * Public Newsletter Subscription Route.
 * Renders a dedicated page for subscribing to the newsletter; the actual signup is handled
 * by the `NewsletterSubscription` form's server action.
 */
export default async function NewsletterPage() {
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
