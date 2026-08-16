import type { Metadata } from 'next'
import { SocialLinks } from '@/components/common/social-links'
import { PageLayout } from '@/components/layout/page-layout'
import { EcosystemLinksRailLayout } from '@/components/links/ecosystem-links-rail'
import { SITE_URL } from '@/constants/constants'
import { linksPageContent } from '@/data/content/links-content'
import { linksSeoContent } from '@/data/content/seo-content'
import { socialGroups } from '@/data/static/social'
import { getBreadcrumbSchema } from '@/lib/json-ld'
import { constructMetadata, getOgImageUrl } from '@/lib/metadata'

export const metadata: Metadata = constructMetadata({
  title: linksSeoContent.title,
  description: linksSeoContent.description,
  path: '/links',
  image: getOgImageUrl(linksSeoContent.ogTitle, 'Links'),
  imageAlt: linksSeoContent.imageAlt,
})

/** Every external profile, grouped by purpose */
export default function LinksPage() {
  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: 'Home', url: SITE_URL },
    { name: 'Links', url: `${SITE_URL}/links` },
  ])

  return (
    <PageLayout
      title={linksPageContent.title}
      subtitle={linksPageContent.subtitle}
      footerText={linksPageContent.footerText}
      breadcrumb={breadcrumbJsonLd}
      className="relative"
    >
      <EcosystemLinksRailLayout>
        <SocialLinks groups={socialGroups} />
      </EcosystemLinksRailLayout>
    </PageLayout>
  )
}
