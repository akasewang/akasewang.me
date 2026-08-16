import 'server-only'
import { createHash, createHmac } from 'node:crypto'

/** A plain digest, for comparing or storing a value without keeping the value itself */
export const sha256Hex = (value: string) => createHash('sha256').update(value).digest('hex')

/**
 * A keyed digest, for anything an outsider could otherwise reproduce. Rate limit keys are the case
 * here: without the secret, a plain hash of an address is a lookup table away from being the address.
 */
export const hmacSha256Hex = (value: string, secret: string) =>
  createHmac('sha256', secret).update(value).digest('hex')
