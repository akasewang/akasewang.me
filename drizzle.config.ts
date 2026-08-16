import { defineConfig } from 'drizzle-kit'

/**
 * Where drizzle-kit reads the tables from and writes migrations to. Used by db:push, which is run
 * by hand rather than in a deployment, since the schema here changes rarely.
 */
export default defineConfig({
  out: './drizzle',
  schema: './src/lib/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.NEON_DATABASE_URL as string,
  },
})
