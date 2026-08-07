import { PageLayout } from '@/components/layout/page-layout'
import { Skeleton } from '@/components/ui/skeleton'
import { newsletterPageContent } from '@/data/content/newsletter-content'

/** Shown while the newsletter page loads, laid out to match it so nothing shifts when the real content arrives */
export default function Loading() {
  return (
    <PageLayout
      title={newsletterPageContent.title}
      subtitle={newsletterPageContent.subtitle}
      footerText="If you've made it this far, you deserve a coffee. Or a nap."
    >
      <div className="flex flex-col gap-2 sm:flex-row">
        <Skeleton className="h-10 w-full sm:flex-1 rounded-md bg-surface-20 ring-1 ring-inset ring-ring/40" />
        <Skeleton className="h-10 w-full sm:w-[140px] shrink-0 rounded-md bg-surface-30" />
      </div>
    </PageLayout>
  )
}
