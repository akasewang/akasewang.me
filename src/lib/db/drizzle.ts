import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

/**
 * The shared database handle, over Neon's HTTP driver so it works from serverless invocations that
 * cannot hold a pooled TCP connection. Missing configuration throws at import, which fails a build
 * rather than every request at runtime.
 */
const databaseUrl = process.env.NEON_DATABASE_URL

if (!databaseUrl) {
  throw new Error('Missing NEON_DATABASE_URL environment variable')
}

const sql = neon(databaseUrl)

export const db = drizzle(sql, { schema })
