import type { Metadata } from 'next'
import { ChangelogTimeline } from '@/components/changelog/changelog-timeline'
import { PageLayout } from '@/components/layout/page-layout'
import { SITE_URL } from '@/constants/constants'
import { changelogPageContent } from '@/data/content/changelog-content'
import { changelogSeoContent } from '@/data/content/seo-content'
import { getBreadcrumbSchema } from '@/lib/json-ld'
import { getChangelog } from '@/lib/managers/changelog-manager'
import { constructMetadata, getOgImageUrl } from '@/lib/metadata'

/** Rebuilt hourly, which is as often as a commit history is worth re-reading from GitHub */
export const revalidate = 3600

export const metadata: Metadata = constructMetadata({
  title: changelogSeoContent.title,
  description: changelogSeoContent.description,
  path: '/changelog',
  image: getOgImageUrl(changelogSeoContent.ogTitle, 'Changelog'),
  imageAlt: changelogSeoContent.imageAlt,
})

/** commits to this site, grouped by day */
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
      footerText={changelogPageContent.footerText}
      breadcrumb={breadcrumbJsonLd}
    >
      <section>
        <ChangelogTimeline days={days} />
      </section>
    </PageLayout>
  )
}
