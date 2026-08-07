import { PageLayout } from '@/components/layout/page-layout'
import { MessageBoardRecentLabel } from '@/components/message-board/message-board-recent-label'
import { Skeleton } from '@/components/ui/skeleton'
import { messageBoardContent } from '@/data/content/message-board-content'

/** Shown while the message board loads, laid out to match it so nothing shifts when the real content arrives */
export default function Loading() {
  return (
    <PageLayout
      title={messageBoardContent.title}
      subtitle={messageBoardContent.subtitle}
      footerText="Parting is such sweet sorrow... unless you leave a message first."
    >
      <div className="space-y-14">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-9 w-full rounded-md bg-surface-20 ring-1 ring-inset ring-ring/40" />
          <Skeleton className="h-24 w-full rounded-md bg-surface-20 ring-1 ring-inset ring-ring/40" />
          <div className="flex justify-end pt-1">
            <Skeleton className="h-8 w-28 rounded-md bg-surface-30/80" />
          </div>
        </div>

        <section className="space-y-8">
          <MessageBoardRecentLabel />

          <div className="space-y-6">
            <div className="flex items-center justify-center py-2">
              <Skeleton className="h-6 w-24 rounded-full bg-surface-40 ring-1 ring-inset ring-ring/40" />
            </div>

            <div className="flex items-start gap-2.5">
              <Skeleton className="mt-0.5 size-8 shrink-0 rounded-full bg-surface-40 ring-1 ring-inset ring-ring/40" />
              <div className="flex max-w-[85%] flex-col items-start sm:max-w-[70%]">
                <div className="min-w-[180px] rounded-2xl rounded-tl-sm bg-surface-40 px-4 py-3 ring-1 ring-inset ring-ring/40">
                  <Skeleton className="mb-2 h-3 w-20 rounded bg-surface-30" />
                  <Skeleton className="mb-1.5 h-3.5 w-48 rounded bg-surface-30/70" />
                  <Skeleton className="h-3.5 w-32 rounded bg-surface-30/70" />
                  <Skeleton className="mt-2.5 ml-auto h-2.5 w-10 rounded bg-surface-30/50" />
                </div>
              </div>
            </div>

            <div className="mt-2 flex items-start justify-end gap-2.5">
              <div className="flex max-w-[85%] flex-col items-end sm:max-w-[70%]">
                <div className="min-w-[180px] rounded-2xl rounded-tr-sm bg-verified/20 px-4 py-3 ring-1 ring-inset ring-verified/40">
                  <Skeleton className="mb-2 h-3 w-24 rounded bg-verified/30" />
                  <Skeleton className="h-3.5 w-44 rounded bg-verified/30" />
                  <Skeleton className="mt-2.5 mr-auto h-2.5 w-10 rounded bg-verified/20" />
                </div>
              </div>
              <Skeleton className="mt-0.5 size-8 shrink-0 rounded-full bg-verified/30 ring-1 ring-inset ring-verified/40" />
            </div>

            <div className="flex items-start gap-2.5">
              <Skeleton className="mt-0.5 size-8 shrink-0 rounded-full bg-surface-40 ring-1 ring-inset ring-ring/40" />
              <div className="flex max-w-[85%] flex-col items-start sm:max-w-[70%]">
                <div className="min-w-[200px] rounded-2xl rounded-tl-sm bg-surface-40 px-4 py-3 ring-1 ring-inset ring-ring/40">
                  <Skeleton className="mb-2 h-3 w-16 rounded bg-surface-30" />
                  <Skeleton className="h-3.5 w-56 rounded bg-surface-30/70" />
                  <Skeleton className="mt-2.5 ml-auto h-2.5 w-10 rounded bg-surface-30/50" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  )
}
