import { desc } from 'drizzle-orm'
import type { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { MessageBoardForm } from '@/components/message-board/message-board-form'
import { MessageBoardList } from '@/components/message-board/message-board-list'
import { MessageBoardRecentLabel } from '@/components/message-board/message-board-recent-label'
import { MESSAGES_PER_PAGE, SITE_URL } from '@/constants/constants'
import { messageBoardContent } from '@/data/content/message-board-content'
import { messageBoardSeoContent } from '@/data/content/seo-content'
import { db } from '@/lib/db/drizzle'
import { messageBoard } from '@/lib/db/schema'
import { getBreadcrumbSchema } from '@/lib/json-ld'
import { constructMetadata, getOgImageUrl } from '@/lib/metadata'
import type { MessageBoardEntry } from '@/types/message-board'

export async function generateMetadata(): Promise<Metadata> {
  return constructMetadata({
    title: messageBoardSeoContent.title,
    description: messageBoardSeoContent.description,
    path: '/message-board',
    image: getOgImageUrl(messageBoardSeoContent.ogTitle, 'Message Board'),
    imageAlt: messageBoardSeoContent.imageAlt,
  })
}

export default async function MessageBoardPage() {
  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: 'Home', url: SITE_URL },
    { name: 'Message Board', url: `${SITE_URL}/message-board` },
  ])

  let messages: MessageBoardEntry[] | null = null

  try {
    messages = await db.query.messageBoard.findMany({
      columns: { ip: false },
      orderBy: [desc(messageBoard.id)],
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
      breadcrumb={breadcrumbJsonLd}
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
