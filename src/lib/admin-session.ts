import 'server-only'
import { randomBytes } from 'node:crypto'
import { eq, lt } from 'drizzle-orm'
import { cookies } from 'next/headers'
import { db } from '@/lib/db/drizzle'
import { adminSession } from '@/lib/db/schema'
import { sha256Hex } from '@/lib/sha256'

const COOKIE_NAME = 'admin_session'
const SESSION_TTL_MINUTES = 60
const SESSION_TTL_MS = SESSION_TTL_MINUTES * 60 * 1000

/**
 * 32 bytes, so the token cannot be guessed like the shorter code that bought it. Nothing rate
 * limits a cookie, so this has to be wide enough that nothing can work through it.
 */
const TOKEN_BYTES = 32

/**
 * httpOnly so no script can read it, which is the whole reason this replaced a value kept in local
 * storage. sameSite lax keeps it off cross site requests, so a form on another origin cannot spend
 * the session, and secure holds it to https everywhere but a local dev server.
 */
export async function startAdminSession() {
  const token = randomBytes(TOKEN_BYTES).toString('hex')
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS)

  /** Swept on the way in, so expired rows do not accumulate without a job to remove them */
  await db.delete(adminSession).where(lt(adminSession.expiresAt, new Date()))
  await db.insert(adminSession).values({ tokenHash: sha256Hex(token), expiresAt })

  const store = await cookies()
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL_MS / 1000,
  })
}

/**
 * The single gate every privileged action passes through. It takes nothing from the caller, so a
 * client can no longer hand over a credential at all and there is nothing for one to forge.
 */
export async function hasAdminSession(): Promise<boolean> {
  const token = (await cookies()).get(COOKIE_NAME)?.value
  if (!token) return false

  const [record] = await db
    .select()
    .from(adminSession)
    .where(eq(adminSession.tokenHash, sha256Hex(token)))
    .limit(1)

  if (!record) return false

  if (record.expiresAt.getTime() < Date.now()) {
    await db.delete(adminSession).where(eq(adminSession.id, record.id))
    return false
  }

  /**
   * The row was found by its hash, so there is nothing left to compare it against. A second check
   * here compared the value to the very thing that fetched it and could only ever agree, which read
   * as a guard while doing none of the work of one.
   */
  return true
}

/** Ends it at both ends, so signing out is not merely the browser forgetting where it put the key */
export async function endAdminSession() {
  const store = await cookies()
  const token = store.get(COOKIE_NAME)?.value

  if (token) {
    await db.delete(adminSession).where(eq(adminSession.tokenHash, sha256Hex(token)))
  }

  store.delete(COOKIE_NAME)
}
