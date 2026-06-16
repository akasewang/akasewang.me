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

export const views = pgTable('views', {
  slug: text('slug').primaryKey(),
  count: integer('count').default(0).notNull(),
})

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
  (table) => {
    return {
      createdAtIndex: index('message_board_created_at_idx').on(table.createdAt),

      ipIndex: index('message_board_ip_idx').on(table.ip),
    }
  },
)
