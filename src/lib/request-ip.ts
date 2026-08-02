import 'server-only'
import { headers } from 'next/headers'

/**
 * Reads the forwarded address the platform sets, taking the first hop since anything after it is
 * caller supplied. Only used to space out submissions, then hashed before it is persisted.
 */
export async function getClientIp() {
  const requestHeaders = await headers()
  const forwardedFor = requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim()
  const realIp = requestHeaders.get('x-real-ip')?.trim()

  return forwardedFor || realIp || '127.0.0.1'
}
