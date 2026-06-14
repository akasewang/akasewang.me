import { PageLayout } from '@/components/layout/page-layout'
import { messageBoardContent } from '@/data/content/message-board-content'

/** Streaming fallback shown while the message board loads its entries from the database. */
export default function Loading() {
  return (
    <PageLayout title={messageBoardContent.title} subtitle={messageBoardContent.subtitle}>
      <div className="space-y-14">
        <div className="h-40 animate-pulse rounded-2xl bg-muted/30" />

        <section className="space-y-8">
          <div className="h-4 w-40 animate-pulse rounded bg-muted/30" />
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl bg-muted/20" />
            ))}
          </div>
        </section>
      </div>
    </PageLayout>
  )
}
