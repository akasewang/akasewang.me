import 'server-only'
import { eq, lte } from 'drizzle-orm'
import { db } from '@/lib/db/drizzle'
import { actionRateLimit } from '@/lib/db/schema'
import { hmacSha256Hex } from '@/lib/sha256'

type RateLimitClaim =
  | { allowed: true; retryAfterSeconds: 0 }
  | { allowed: false; retryAfterSeconds: number }

/**
 * Atomically claims a fixed cooldown. The conditional upsert is one Postgres statement, so two
 * serverless requests for the same client cannot both pass the check before either writes.
 */
export async function claimRateLimit(
  action: string,
  clientIp: string,
  cooldownSeconds: number,
): Promise<RateLimitClaim> {
  const secret = process.env.RATE_LIMIT_SECRET
  if (!secret) throw new Error('Missing RATE_LIMIT_SECRET environment variable')

  /** Keyed rather than plain, so the stored row cannot be walked back to the address it came from */
  const key = hmacSha256Hex(`${action}\0${clientIp}`, secret)
  const now = new Date()
  const expiresAt = new Date(now.getTime() + cooldownSeconds * 1000)

  const [claimed] = await db
    .insert(actionRateLimit)
    .values({ key, expiresAt })
    .onConflictDoUpdate({
      target: actionRateLimit.key,
      set: { expiresAt },
      setWhere: lte(actionRateLimit.expiresAt, now),
    })
    .returning({ expiresAt: actionRateLimit.expiresAt })

  if (claimed) return { allowed: true, retryAfterSeconds: 0 }

  /** Nothing came back, so a live cooldown blocked the write and the caller is owed the wait */
  const [current] = await db
    .select({ expiresAt: actionRateLimit.expiresAt })
    .from(actionRateLimit)
    .where(eq(actionRateLimit.key, key))
    .limit(1)

  const remaining = current
    ? Math.max(1, Math.ceil((current.expiresAt.getTime() - Date.now()) / 1000))
    : cooldownSeconds

  return { allowed: false, retryAfterSeconds: remaining }
}
