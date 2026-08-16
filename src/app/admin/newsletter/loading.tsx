import { PageLayout } from '@/components/layout/page-layout'
import { SkeletonButton, SkeletonField } from '@/components/skeletons/shared'
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
      <div className="flex flex-col gap-4">
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonField key={index} />
          ))}
        </div>

        <div className="flex justify-end">
          <SkeletonButton className="sm:w-40" />
        </div>
      </div>
    </PageLayout>
  )
}
