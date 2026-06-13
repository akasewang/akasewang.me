import { Metadata } from 'next'
import { ChangelogTimeline } from '@/components/changelog/changelog-timeline'
import { PageLayout } from '@/components/layout/page-layout'
import { SITE_URL } from '@/constants/constants'
import { changelogPageContent } from '@/data/content/changelog-content'
import { changelogSeoContent } from '@/data/content/seo-content'
import { getBreadcrumbSchema } from '@/lib/json-ld'
import { getChangelog } from '@/lib/managers/changelog-manager'
import { constructMetadata, getOgImageUrl } from '@/lib/metadata'

/** Regenerate the page hourly so fresh commits appear without a redeploy. */
export const revalidate = 3600

/** Statically generated metadata for the Changelog page. */
export async function generateMetadata(): Promise<Metadata> {
  return constructMetadata({
    title: changelogSeoContent.title,
    description: changelogSeoContent.description,
    path: '/changelog',
    image: getOgImageUrl(changelogSeoContent.ogTitle, 'Changelog'),
    imageAlt: changelogSeoContent.imageAlt,
  })
}

/**
 * Main Changelog Route.
 * Treats the site like a software product, rendering its GitHub commit history
 * as a release notes timeline. Data is fetched server side and revalidated hourly.
 */
export default async function ChangelogPage() {
  const days = await getChangelog()

  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: 'Home', url: SITE_URL },
    { name: 'Changelog', url: `${SITE_URL}/changelog` },
  ])

  return (
    <PageLayout
      title={changelogPageContent.title}
      subtitle={changelogPageContent.subtitle}
      footerText="That's everything shipped so far. This page writes itself, one commit at a time."
      breadcrumb={breadcrumbJsonLd}
    >
      <section>
        <ChangelogTimeline days={days} />
      </section>
    </PageLayout>
  )
}
