import { PageLayout } from '@/components/layout/page-layout'
import { SkeletonButton } from '@/components/skeletons/shared'
import { Skeleton, SkeletonText } from '@/components/ui/skeleton'
import { unsubscribeContent } from '@/data/content/unsubscribe-content'

/** Shown while the unsubscribe page loads, laid out to match it so nothing shifts when the real content arrives */
export default function Loading() {
  return (
    <PageLayout footerText={unsubscribeContent.footerText}>
      <div className="space-y-6">
        <div className="space-y-3">
          <Skeleton tone="strong" className="h-7 w-48" />
          <SkeletonText lines={2} tone="muted" lastLineWidth="w-1/2" />
        </div>
        <SkeletonButton />
      </div>
    </PageLayout>
  )
}
