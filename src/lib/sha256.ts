import 'server-only'
import { createHash, createHmac } from 'node:crypto'

export const sha256Hex = (value: string) => createHash('sha256').update(value).digest('hex')

export const hmacSha256Hex = (value: string, secret: string) =>
  createHmac('sha256', secret).update(value).digest('hex')
