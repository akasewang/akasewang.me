import { PageLayout } from '@/components/layout/page-layout'
import { SocialLinksSkeleton } from '@/components/skeletons/social-links'
import { domainsPageContent } from '@/data/content/domains-content'
import { domainGroups } from '@/data/static/domains'

/** Matches the directory while the route streams, read from the same data so it cannot drift */
export default function Loading() {
  return (
    <PageLayout
      title={domainsPageContent.title}
      subtitle={domainsPageContent.subtitle}
      footerText={domainsPageContent.footerText}
    >
      <SocialLinksSkeleton groups={domainGroups} />
    </PageLayout>
  )
}
