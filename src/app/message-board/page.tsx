import { Metadata } from 'next'
import { desc } from 'drizzle-orm'
import { db } from '@/lib/db/drizzle'
import { messageBoard } from '@/lib/db/schema'
import type { MessageBoardEntry } from '@/types/message-board'
import { messageBoardContent } from '@/data/content/message-board-content'
import { messageBoardSeoContent } from '@/data/content/seo-content'
import { MESSAGES_PER_PAGE } from '@/constants/constants'
import { MessageBoardForm } from '@/components/message-board/message-board-form'
import { MessageBoardList } from '@/components/message-board/message-board-list'
import { MessageBoardRecentLabel } from '@/components/message-board/message-board-recent-label'
import { PageLayout } from '@/components/layout/page-layout'
import { constructMetadata, getOgImageUrl } from '@/lib/metadata'

/** Resolves static SEO metadata for the message board page. */
export async function generateMetadata(): Promise<Metadata> {
  return constructMetadata({
    title: messageBoardSeoContent.title,
    description: messageBoardSeoContent.description,
    path: '/message-board',
    image: getOgImageUrl(messageBoardSeoContent.ogTitle, 'Message Board'),
    imageAlt: messageBoardSeoContent.imageAlt,
  })
}

/**
 * Server Component responsible for the public message board.
 * Fetches the most recent, paginated messages directly from the database to ensure rapid TTFB.
 */
export default async function MessageBoardPage() {
  let messages: MessageBoardEntry[] | null = null

  try {
    /**
     * Fetch messages chronologically descending.
     * Security: Explicitly exclude the IP column from the payload so it never reaches the client bundle.
     */
    messages = await db.query.messageBoard.findMany({
      columns: { ip: false },
      orderBy: [desc(messageBoard.createdAt)],
      limit: MESSAGES_PER_PAGE,
    })
  } catch (error) {
    console.error('Database query failed:', error instanceof Error ? error.message : String(error))
  }

  return (
    <PageLayout
      title={messageBoardContent.title}
      subtitle={messageBoardContent.subtitle}
      footerText="Parting is such sweet sorrow... unless you leave a message first."
    >
      <div className="space-y-14">
        <MessageBoardForm />

        <section className="space-y-8">
          <MessageBoardRecentLabel />
          <MessageBoardList messages={messages} />
        </section>
      </div>
    </PageLayout>
  )
}
