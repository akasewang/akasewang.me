import {
  pgTable,
  text,
  integer,
  timestamp,
  serial,
  boolean,
  uuid,
  index,
} from 'drizzle-orm/pg-core'

/** Drizzle schema representing page view counters per route slug. */
export const views = pgTable('views', {
  slug: text('slug').primaryKey(),
  count: integer('count').default(0).notNull(),
  installs: integer('installs').default(0).notNull(),
})

/**
 * Drizzle schema storing verified newsletter subscriber email addresses.
 * Includes a UUID token for secure 1-click unsubscribe links.
 */
export const newsletterSubscribers = pgTable('newsletter_subscribers', {
  email: text('email').primaryKey(),
  token: uuid('token').defaultRandom().notNull().unique(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

/**
 * Drizzle schema holding public user messages and potential admin replies.
 * Includes IP addresses for rate limiting purposes.
 */
export const messageBoard = pgTable(
  'message_board',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    message: text('message').notNull(),
    adminReply: text('admin_reply'),
    ip: text('ip').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      /** Index on createdAt to optimize pagination and chronological sorting */
      createdAtIndex: index('message_board_created_at_idx').on(table.createdAt),
      /** Index on IP address to speed up rate limiting lookups */
      ipIndex: index('message_board_ip_idx').on(table.ip),
    }
  },
)
