'use server'

import { eq } from 'drizzle-orm'
import { db } from '@/lib/db/drizzle'
import { newsletterSubscribers } from '@/lib/db/schema'

/** What the page has to say back: the link worked, the link is stale, or this side broke */
export type UnsubscribeResult = 'success' | 'invalid' | 'error'

/**
 * The column is a uuid, so anything that is not one fails to cast inside Postgres and would come
 * back as an error rather than the invalid this promises. A mangled link is a stale link.
 */
const TOKEN_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Takes the token from the link and deactivates whichever subscriber it belongs to. The row is
 * deactivated rather than deleted, so the same token keeps working if the address ever resubscribes.
 * An unknown token is invalid rather than an error, that being a stale link and not a fault.
 */
export async function unsubscribeAction(token: string): Promise<UnsubscribeResult> {
  if (typeof token !== 'string') return 'invalid'

  const normalizedToken = token.trim()
  if (!TOKEN_REGEX.test(normalizedToken)) return 'invalid'

  try {
    const updated = await db
      .update(newsletterSubscribers)
      .set({ isActive: false })
      .where(eq(newsletterSubscribers.token, normalizedToken))
      .returning({ email: newsletterSubscribers.email })
    return updated.length > 0 ? 'success' : 'invalid'
  } catch (err) {
    console.error('Error during unsubscribe:', err instanceof Error ? err.message : err)
    return 'error'
  }
}
