import { db } from '@/lib/db/drizzle'
import { newsletterSubscribers } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { unsubscribeContent } from '@/data/content/unsubscribe-content'
import { PageLayout } from '@/components/layout/page-layout'

/** Props for the unsubscribe route; the `token` is read from `searchParams`. */
type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

/**
 * Unsubscribe Route.
 * Server side rendered route that handles one click unsubscribe links from the newsletter.
 * Extracts the secret `token` from the URL search parameters and deactivates the corresponding user in the database.
 */
export default async function UnsubscribePage({ searchParams }: Props) {
  const resolvedParams = await searchParams
  const token = typeof resolvedParams.token === 'string' ? resolvedParams.token : null

  let status: 'success' | 'invalid' | 'error' = 'invalid'

  if (token) {
    try {
      const updatedUser = await db
        .update(newsletterSubscribers)
        .set({ isActive: false })
        .where(eq(newsletterSubscribers.token, token))
        .returning({ updatedEmail: newsletterSubscribers.email })

      status = updatedUser.length > 0 ? 'success' : 'invalid'
    } catch (err) {
      console.error('Error during unsubscribe:', err instanceof Error ? err.message : err)
      status = 'error'
    }
  }

  const { title, description } = {
    success: {
      title: unsubscribeContent.successTitle,
      description: unsubscribeContent.successDescription,
    },
    invalid: {
      title: unsubscribeContent.invalidTitle,
      description: unsubscribeContent.invalidDescription,
    },
    error: {
      title: unsubscribeContent.errorTitle,
      description: unsubscribeContent.errorDescription,
    },
  }[status]

  return (
    <PageLayout
      title={title}
      subtitle={description}
      footerText="Sad to see you go, but I still like you."
      className="flex min-h-[70vh] flex-col items-center justify-center text-center"
    />
  )
}
