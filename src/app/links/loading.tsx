import { PageLayout } from '@/components/layout/page-layout'
import { EcosystemLinksRailLayout } from '@/components/links/ecosystem-links-rail'
import { SocialLinksSkeleton } from '@/components/skeletons/social-links'
import { linksPageContent } from '@/data/content/links-content'
import { socialGroups } from '@/data/static/social'

/** Matches the grouped links directory while its route is streaming, from the same data it draws */
export default function Loading() {
  return (
    <PageLayout
      title={linksPageContent.title}
      subtitle={linksPageContent.subtitle}
      footerText={linksPageContent.footerText}
      className="relative"
    >
      <EcosystemLinksRailLayout loading>
        <SocialLinksSkeleton groups={socialGroups} />
      </EcosystemLinksRailLayout>
    </PageLayout>
  )
}
