import { PageLayout } from '@/components/layout/page-layout'
import { MessageBoardRecentLabel } from '@/components/message-board/message-board-recent-label'
import { IncomingMessageSkeleton, ReplyMessageSkeleton } from '@/components/skeletons/message-board'
import { SkeletonButton, SkeletonField } from '@/components/skeletons/shared'
import { Skeleton } from '@/components/ui/skeleton'
import { messageBoardContent } from '@/data/content/message-board-content'

/** Shown while the message board loads, laid out to match it so nothing shifts when the real content arrives */
export default function Loading() {
  return (
    <PageLayout
      title={messageBoardContent.title}
      subtitle={messageBoardContent.subtitle}
      footerText={messageBoardContent.footerText}
    >
      <div className="space-y-14">
        <div className="flex flex-col gap-4">
          <SkeletonField />
          {/* The message box, at the height three rows of it come to */}
          <SkeletonField className="h-23" />
          <div className="flex justify-end pt-1">
            <SkeletonButton />
          </div>
        </div>

        <section className="space-y-8">
          <MessageBoardRecentLabel />

          <div className="space-y-6">
            <div className="flex items-center justify-center py-2">
              <Skeleton
                tone="muted"
                className="h-6 w-24 rounded-full ring-1 ring-inset ring-ring/40 retina:ring-[0.5px]"
              />
            </div>

            <IncomingMessageSkeleton lines={2} />
            <ReplyMessageSkeleton />
            <IncomingMessageSkeleton lines={1} />
          </div>
        </section>
      </div>
    </PageLayout>
  )
}
