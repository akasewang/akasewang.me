import { PageLayout } from '@/components/layout/page-layout'
import { Skeleton } from '@/components/ui/skeleton'

/** Shown while the unsubscribe page loads, laid out to match it so nothing shifts when the real content arrives */
export default function Loading() {
  return (
    <PageLayout footerText="Sad to see you go, but I still like you.">
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 rounded bg-surface-30" />
          <Skeleton className="h-4 w-72 rounded bg-surface-20" />
        </div>
        <Skeleton className="h-9 w-32 rounded-md bg-surface-30" />
      </div>
    </PageLayout>
  )
}
