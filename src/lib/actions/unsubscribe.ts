'use server'

import { eq } from 'drizzle-orm'
import { db } from '@/lib/db/drizzle'
import { newsletterSubscribers } from '@/lib/db/schema'

export type UnsubscribeResult = 'success' | 'invalid' | 'error'
export async function unsubscribeAction(token: string): Promise<UnsubscribeResult> {
  if (typeof token !== 'string') return 'invalid'

  const normalizedToken = token.trim()
  if (!normalizedToken) return 'invalid'
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
