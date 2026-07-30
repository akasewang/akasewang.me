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
 * Email keyed, so subscribing twice cannot create a duplicate. Unsubscribing flips isActive rather
 * than deleting, which keeps the token stable for any link already sitting in an inbox.
 */
export const newsletterSubscribers = pgTable('newsletter_subscribers', {
  email: text('email').primaryKey(),
  token: uuid('token').defaultRandom().notNull().unique(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

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
  /**
   * Both indexes serve the rate limit, which looks a submission up by address and recency. Paging
   * rides the id primary key instead, so it needs nothing here.
   */
  (table) => {
    return {
      createdAtIndex: index('message_board_created_at_idx').on(table.createdAt),

      ipIndex: index('message_board_ip_idx').on(table.ip),
    }
  },
)
