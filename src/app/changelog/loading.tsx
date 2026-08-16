import { PageLayout } from '@/components/layout/page-layout'
import { ChangelogTimelineSkeleton } from '@/components/skeletons/changelog'
import { changelogPageContent } from '@/data/content/changelog-content'

/** Matches the timeline while the route streams, from the geometry the timeline itself draws with */
export default function Loading() {
  return (
    <PageLayout
      title={changelogPageContent.title}
      subtitle={changelogPageContent.subtitle}
      footerText={changelogPageContent.footerText}
    >
      <ChangelogTimelineSkeleton />
    </PageLayout>
  )
}
