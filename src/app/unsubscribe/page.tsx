import { unsubscribeContent } from '@/data/content/unsubscribe-content'
import { PageLayout } from '@/components/layout/page-layout'
import { UnsubscribeConfirm } from '@/components/common/unsubscribe-confirm'
import { Metadata } from 'next'

/** Keeps the transactional unsubscribe route, and its per subscriber token URLs, out of search indexes. */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

/** Props for the unsubscribe route; the `token` is read from `searchParams`. */
type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

/**
 * Unsubscribe Route. Renders a confirmation prompt for one click unsubscribe links; the subscriber is
 * deactivated only after they click confirm, never on page load. A missing token shows the invalid state.
 */
export default async function UnsubscribePage({ searchParams }: Props) {
  const resolvedParams = await searchParams
  const token = typeof resolvedParams.token === 'string' ? resolvedParams.token : null

  if (!token) {
    return (
      <PageLayout
        title={unsubscribeContent.invalidTitle}
        subtitle={unsubscribeContent.invalidDescription}
        footerText="Sad to see you go, but I still like you."
        className="flex min-h-[70vh] flex-col items-center justify-center text-center"
      />
    )
  }

  return (
    <PageLayout
      footerText="Sad to see you go, but I still like you."
      className="flex min-h-[70vh] flex-col items-center justify-center text-center"
    >
      <UnsubscribeConfirm token={token} content={unsubscribeContent} />
    </PageLayout>
  )
}
