import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

const databaseUrl = process.env.NEON_DATABASE_URL

if (!databaseUrl) {
  throw new Error('Missing NEON_DATABASE_URL environment variable')
}

const sql = neon(databaseUrl)

export const db = drizzle(sql, { schema })
