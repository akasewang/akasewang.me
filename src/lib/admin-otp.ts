import 'server-only'
import { randomInt, timingSafeEqual } from 'node:crypto'
import { desc, eq, sql } from 'drizzle-orm'
import { ADMIN_CODE_ALPHABET, ADMIN_CODE_LENGTH, ADMIN_CODE_SHAPE } from '@/constants/constants'
import { db } from '@/lib/db/drizzle'
import { adminOtp } from '@/lib/db/schema'
import { sha256Hex } from '@/lib/sha256'

/** How long a code lives, how many guesses it allows, and how often a new one can be asked for */
export const OTP_TTL_MINUTES = 10
const OTP_TTL_MS = OTP_TTL_MINUTES * 60 * 1000
export const OTP_MAX_ATTEMPTS = 5
const REISSUE_INTERVAL_MS = 60 * 1000

/** Compared in constant time, so the comparison itself gives nothing away about the code */
const hashesMatch = (a: string, b: string) => {
  const left = Buffer.from(a, 'hex')
  const right = Buffer.from(b, 'hex')
  return left.length === right.length && timingSafeEqual(left, right)
}

/**
 * Resolves the recipient address where the admin code should be sent.
 * Uses RESEND_ADMIN_EMAIL.
 */
export const adminRecipient = () => process.env.RESEND_ADMIN_EMAIL?.trim().toLowerCase() || null

/**
 * Resolves the sender email address for OTP emails.
 * Uses RESEND_OTP_EMAIL.
 */
export const otpSender = () => process.env.RESEND_OTP_EMAIL?.trim() || null

/**
 * Validates whether the given email matches the configured admin email.
 * Hashed before comparing so both sides are equal length, stopping length leakage.
 */
export function isAdminAddress(email: unknown): boolean {
  if (typeof email !== 'string') return false
  const normalized = email.trim().toLowerCase()

  const admin = adminRecipient()
  if (!admin) return false

  return hashesMatch(sha256Hex(admin), sha256Hex(normalized))
}

type IssuedOtp = { code: string } | { retryInSeconds: number }

/**
 * randomInt rather than Math.random, which is seeded well enough to predict and has no business
 * generating a credential. Padded because a leading zero is a digit, not an absence of one.
 */
export async function issueAdminOtp(): Promise<IssuedOtp> {
  const [latest] = await db.select().from(adminOtp).orderBy(desc(adminOtp.id)).limit(1)

  if (latest) {
    const age = Date.now() - latest.createdAt.getTime()
    if (age < REISSUE_INTERVAL_MS) {
      return { retryInSeconds: Math.ceil((REISSUE_INTERVAL_MS - age) / 1000) }
    }
  }

  /**
   * Drawn a character at a time from the alphabet. randomInt over the exact length is uniform, where
   * a modulo of some larger random number would lean on whichever characters came first.
   */
  const code = Array.from(
    { length: ADMIN_CODE_LENGTH },
    () => ADMIN_CODE_ALPHABET[randomInt(0, ADMIN_CODE_ALPHABET.length)],
  ).join('')

  await db.delete(adminOtp)
  await db.insert(adminOtp).values({
    codeHash: sha256Hex(code),
    expiresAt: new Date(Date.now() + OTP_TTL_MS),
  })

  return { code }
}

/**
 * A code stays usable until it expires rather than being spent on first use, so one round of admin
 * work does not need a fresh mail per action. What bounds it is the window and the attempt count:
 * five wrong guesses burn the code and strictly bound online attempts during its lifetime.
 */
export async function verifyAdminOtp(code: unknown): Promise<boolean> {
  if (typeof code !== 'string' || !ADMIN_CODE_SHAPE.test(code.trim())) return false

  const [record] = await db.select().from(adminOtp).orderBy(desc(adminOtp.id)).limit(1)
  if (!record) return false

  /**
   * A dead code is left where it is rather than cleared. Issuing reads this same row to hold the
   * next code back for a minute, so deleting it here handed that minute away: five wrong guesses
   * would kill the row, and with the row went the wait before another code could be asked for.
   */
  if (record.expiresAt.getTime() < Date.now() || record.attempts >= OTP_MAX_ATTEMPTS) return false

  if (!hashesMatch(record.codeHash, sha256Hex(code.trim()))) {
    /**
     * Counted in the database rather than read, added to and written back. Two guesses arriving
     * together would otherwise both read the same number and both store one more than it, so the
     * attempt ceiling could be walked straight past.
     */
    await db
      .update(adminOtp)
      .set({ attempts: sql`${adminOtp.attempts} + 1` })
      .where(eq(adminOtp.id, record.id))
    return false
  }

  return true
}
