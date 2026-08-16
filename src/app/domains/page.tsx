import type { Metadata } from 'next'
import { SocialLinks } from '@/components/common/social-links'
import { PageLayout } from '@/components/layout/page-layout'
import { SITE_URL } from '@/constants/constants'
import { domainsPageContent } from '@/data/content/domains-content'
import { domainsSeoContent } from '@/data/content/seo-content'
import { domainGroups } from '@/data/static/domains'
import { getBreadcrumbSchema } from '@/lib/json-ld'
import { constructMetadata, getOgImageUrl } from '@/lib/metadata'

export const metadata: Metadata = constructMetadata({
  title: domainsSeoContent.title,
  description: domainsSeoContent.description,
  path: '/domains',
  image: getOgImageUrl(domainsSeoContent.ogTitle, 'Registered Domains'),
  imageAlt: domainsSeoContent.imageAlt,
})

/**
 * The domains, grouped by what each one is for. Reached from the command menu rather than the
 * navbar, and drawn with the links directory so an entry with nowhere to go is stated not linked.
 */
export default function DomainsPage() {
  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: 'Home', url: SITE_URL },
    { name: 'Registered Domains', url: `${SITE_URL}/domains` },
  ])

  return (
    <PageLayout
      title={domainsPageContent.title}
      subtitle={domainsPageContent.subtitle}
      footerText={domainsPageContent.footerText}
      breadcrumb={breadcrumbJsonLd}
    >
      <section>
        <SocialLinks groups={domainGroups} />
      </section>
    </PageLayout>
  )
}
