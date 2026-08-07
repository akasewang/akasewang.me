import { PageLayout } from '@/components/layout/page-layout'
import { Skeleton } from '@/components/ui/skeleton'
import { blogsListingContent } from '@/data/content/blogs-content'

/** Shown while the blogs listing loads, laid out to match it so nothing shifts when the real content arrives */
export default function Loading() {
  return (
    <PageLayout
      title={blogsListingContent.title}
      subtitle={blogsListingContent.subtitle}
      footerText="If you've made it this far, you deserve a coffee. Or a nap."
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-9 w-36 rounded-md bg-surface-30" />
          <Skeleton className="h-9 w-40 rounded-md bg-surface-20 ring-1 ring-inset ring-ring/30" />
        </div>

        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 flex-1 rounded-md bg-surface-20 ring-1 ring-inset ring-ring/40" />
            <Skeleton className="size-9 shrink-0 rounded-md bg-surface-20 ring-1 ring-inset ring-ring/40" />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 border-b border-border/40 pb-3">
            <Skeleton className="h-7 w-16 rounded-full bg-surface-30" />
            <Skeleton className="h-7 w-20 rounded-full bg-surface-20" />
            <Skeleton className="h-7 w-20 rounded-full bg-surface-20" />
          </div>
        </div>

        <div className="space-y-4 pt-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="-mx-2 -my-1.5 flex flex-col gap-2 rounded-xl px-2 py-2 sm:-mx-3 sm:-my-2 sm:px-3 sm:py-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                <Skeleton className="h-5 w-2/3 sm:w-1/2 rounded bg-surface-30" />
                <Skeleton className="mt-1 sm:mt-0 h-3.5 w-28 rounded bg-surface-20" />
              </div>
              <Skeleton className="h-4 w-4/5 rounded bg-surface-30/60" />
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  )
}
