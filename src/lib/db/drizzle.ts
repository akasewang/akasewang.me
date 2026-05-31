import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

/** Initialize the Neon serverless HTTP driver (avoids connection limits common in serverless edge environments) */
const sql = neon(process.env.NEON_DATABASE_URL!)
/**
 * Configured instance of Drizzle ORM using Neon Serverless Postgres.
 * Handles all core application database operations over HTTP.
 */
export const db = drizzle(sql, { schema })
