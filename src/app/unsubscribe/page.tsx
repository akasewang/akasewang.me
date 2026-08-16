import type { Metadata } from 'next'
import { UnsubscribeConfirm } from '@/components/common/unsubscribe-confirm'
import { PageLayout } from '@/components/layout/page-layout'
import { unsubscribeContent } from '@/data/content/unsubscribe-content'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

/** Where the unsubscribe link in an email lands, carrying the token that identifies the reader */
export default async function UnsubscribePage({ searchParams }: Props) {
  const resolvedParams = await searchParams
  const token = typeof resolvedParams.token === 'string' ? resolvedParams.token.trim() : null

  if (!token) {
    return (
      <PageLayout
        title={unsubscribeContent.invalidTitle}
        subtitle={unsubscribeContent.invalidDescription}
        footerText={unsubscribeContent.footerText}
      />
    )
  }

  return (
    <PageLayout footerText={unsubscribeContent.footerText}>
      <UnsubscribeConfirm token={token} content={unsubscribeContent} />
    </PageLayout>
  )
}
