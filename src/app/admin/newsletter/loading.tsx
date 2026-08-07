import { PageLayout } from '@/components/layout/page-layout'
import { Skeleton } from '@/components/ui/skeleton'
import { adminNewsletterContent } from '@/data/content/admin-content'

/** Shown while the newsletter admin page loads, laid out to match it so nothing shifts when the real content arrives */
export default function Loading() {
  return (
    <PageLayout
      title={adminNewsletterContent.title}
      subtitle={adminNewsletterContent.description}
      backButtonHref="/"
      className="max-w-2xl"
    >
      <div className="space-y-4">
        <Skeleton className="h-10 w-full rounded-md bg-surface-20 ring-1 ring-inset ring-ring/40" />
        <Skeleton className="h-10 w-full rounded-md bg-surface-20 ring-1 ring-inset ring-ring/40" />
        <Skeleton className="h-10 w-full rounded-md bg-surface-20 ring-1 ring-inset ring-ring/40" />
        <div className="flex justify-end pt-2">
          <Skeleton className="h-10 w-36 rounded-md bg-surface-30" />
        </div>
      </div>
    </PageLayout>
  )
}
