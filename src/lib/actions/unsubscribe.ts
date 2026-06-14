'use server'

import { db } from '@/lib/db/drizzle'
import { newsletterSubscribers } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

/** Terminal outcome of an unsubscribe confirmation, mapped to distinct copy by the UI. */
export type UnsubscribeResult = 'success' | 'invalid' | 'error'

/**
 * Deactivates the subscriber that owns `token`. Runs only from an explicit confirmation click, never
 * on link load, so email security scanners and link prefetchers that follow the unsubscribe URL
 * cannot silently remove subscribers.
 *
 * @param token - The per subscriber UUID embedded in the unsubscribe link.
 * @returns `success` when a subscriber was deactivated, `invalid` for an unknown token, `error` on failure.
 */
export async function unsubscribeAction(token: string): Promise<UnsubscribeResult> {
  if (!token) return 'invalid'

  try {
    const updated = await db
      .update(newsletterSubscribers)
      .set({ isActive: false })
      .where(eq(newsletterSubscribers.token, token))
      .returning({ email: newsletterSubscribers.email })

    return updated.length > 0 ? 'success' : 'invalid'
  } catch (err) {
    console.error('Error during unsubscribe:', err instanceof Error ? err.message : err)
    return 'error'
  }
}
