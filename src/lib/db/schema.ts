import {
  boolean,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'

/** Slug keyed, so a page's count needs no lookup table and no row until its first view */
export const views = pgTable('views', {
  slug: text('slug').primaryKey(),
  count: integer('count').default(0).notNull(),
})

/**
 * One atomic cooldown per action and client. The key is an HMAC digest of the action and IP, so
 * public actions can be limited across tabs, browsers and serverless instances without retaining
 * the raw address. An upsert advances an expired row and lets only one concurrent request win.
 */
export const actionRateLimit = pgTable(
  'action_rate_limit',
  {
    key: text('key').primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
  },
  (table) => ({
    expiresAtIndex: index('action_rate_limit_expires_at_idx').on(table.expiresAt),
  }),
)

/**
 * The live admin code, of which there is only ever one. Issuing a new one clears whatever came
 * before, so a code that leaks stops working the moment the next is asked for. Only the hash is
 * kept, and the attempt count bounds online guessing of the eight-character code.
 */
export const adminOtp = pgTable('admin_otp', {
  id: serial('id').primaryKey(),
  codeHash: text('code_hash').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  attempts: integer('attempts').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

/**
 * What a correct code is exchanged for. Held here rather than signed into the cookie alone so that
 * signing out actually ends it, and so a session can be cut short from the database if it needs to
 * be. Only the hash is stored; the cookie carries the token itself and is not readable by scripts.
 */
export const adminSession = pgTable('admin_session', {
  id: serial('id').primaryKey(),
  tokenHash: text('token_hash').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

/**
 * Email keyed, so subscribing twice cannot create a duplicate. Unsubscribing flips isActive rather
 * than deleting, which keeps the token stable for any link already sitting in an inbox.
 */
export const newsletterSubscribers = pgTable('newsletter_subscribers', {
  email: text('email').primaryKey(),
  token: uuid('token').defaultRandom().notNull().unique(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const messageBoard = pgTable('message_board', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  message: text('message').notNull(),
  adminReply: text('admin_reply'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
