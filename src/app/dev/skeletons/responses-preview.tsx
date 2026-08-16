'use client'

import { type ReactNode, useState } from 'react'
import { CategoryTransition } from '@/components/common/category-transition'
import { SubCategoryFilter } from '@/components/common/sub-category-filter'
import { MessageBoardForm } from '@/components/message-board/message-board-form'
import { MessageBoardList } from '@/components/message-board/message-board-list'
import {
  BoardSkeleton,
  ResponsesEmpty,
  ResponsesSection,
} from '@/components/message-board/post-message-board'
import { POST_BOARD_PAGE_SIZE } from '@/constants/constants'
import type { MessageBoardEntry } from '@/types/message-board'

/**
 * Midnight today, so every sample time is an offset from one fixed point. Taken from the clock
 * rather than hardcoded, which is what keeps the day headings reading Today and Yesterday, and
 * rounded to the day so the server and the client agree on it during hydration.
 */
const startOfToday = () => {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
}

const HOUR = 60 * 60 * 1000
const DAY = 24 * HOUR

const BASE = startOfToday()

/**
 * Invented rather than read. A real board would need the database, would be empty on a fresh clone
 * and would look different on every machine, none of which is useful for judging the design.
 *
 * Shaped to put every state on screen at once: two days so a date heading falls between them, one
 * message answered days later so the reply carries its date, and one answered the same day so it
 * carries only a time.
 */
const SAMPLE: MessageBoardEntry[] = [
  {
    id: 110,
    name: 'imogen',
    message: 'Just came back to this one. Still holds up.',
    createdAt: new Date(BASE + 9 * HOUR),
  },
  {
    id: 109,
    name: 'ravi kulkarni',
    message: 'The bit about the trailing slash finally made this click for me. Thank you.',
    createdAt: new Date(BASE + 7 * HOUR),
    adminReply: 'Glad it landed. That one took me an embarrassingly long time to work out.',
    adminReplyAt: new Date(BASE + 8 * HOUR),
  },
  { id: 108, name: 't', message: 'short one', createdAt: new Date(BASE + 5 * HOUR) },
  {
    id: 107,
    name: 'Marguerite Vandenberghe',
    message:
      'A longer response, the kind that runs past a single line and keeps going, so the bubble has to wrap and the width it stops at can actually be judged rather than guessed at.',
    createdAt: new Date(BASE + 2 * HOUR),
  },
  {
    id: 106,
    name: 'dev',
    message:
      'Asked this three days ago and got an answer today, so the reply carries its own date.',
    createdAt: new Date(BASE - 3 * DAY + 14 * HOUR),
    adminReply: 'Answered late, which is exactly the case the reply stamp exists for.',
    adminReplyAt: new Date(BASE + 1 * HOUR),
  },
  {
    id: 105,
    name: 'anon',
    message: 'emoji hold up fine 🧪 and so do accents ünïcødé',
    createdAt: new Date(BASE - DAY + 20 * HOUR),
  },
  {
    id: 104,
    name: 'sam',
    message: 'Second the above.',
    createdAt: new Date(BASE - DAY + 18 * HOUR),
  },
  {
    id: 103,
    name: 'priya',
    message: 'Bookmarking this for the next time it bites me.',
    createdAt: new Date(BASE - DAY + 15 * HOUR),
  },
  {
    id: 102,
    name: 'kenji',
    message: 'Any chance of a follow up on the caching side?',
    createdAt: new Date(BASE - DAY + 11 * HOUR),
  },
  { id: 101, name: 'lou', message: 'First.', createdAt: new Date(BASE - DAY + 9 * HOUR) },
]

/** Every variant writes to the same key, which names no page, so none of them can post anything */
const PREVIEW_SLUG = 'blogs/preview'

const VARIANTS = [
  { value: 'loading', label: 'still loading' },
  { value: 'populated', label: 'with responses' },
  { value: 'complete', label: 'fully loaded' },
  { value: 'empty', label: 'a quiet board' },
  { value: 'offline', label: 'unreachable' },
] as const

type VariantId = (typeof VARIANTS)[number]['value']

/** The order the chips sit in, which is what tells the panel which way to travel */
const VARIANT_ORDER = VARIANTS.map((variant) => variant.value)

/** Shared by every variant, since only the board beneath the form differs between them */
const boardProps = {
  boardSlug: PREVIEW_SLUG,
  pageSize: POST_BOARD_PAGE_SIZE,
  paging: 'button',
  emptyState: <ResponsesEmpty />,
} as const

/**
 * Keyed by the union rather than looked up loosely, so a variant added above without a body here
 * fails to compile instead of quietly rendering nothing.
 */
const BOARDS: Record<VariantId, { total?: number | null; board: ReactNode }> = {
  loading: { board: <BoardSkeleton /> },
  populated: {
    total: 14,
    board: <MessageBoardList {...boardProps} messages={SAMPLE} initialHasMore />,
  },
  complete: {
    total: SAMPLE.length,
    board: <MessageBoardList {...boardProps} messages={SAMPLE} initialHasMore={false} />,
  },
  empty: { total: 0, board: <MessageBoardList {...boardProps} messages={[]} /> },
  offline: { board: <MessageBoardList {...boardProps} messages={null} /> },
}

/**
 * The responses section in each state it can be in, which is otherwise hard to see: a board only
 * shows one of them at a time, and reaching the others means having the right number of messages.
 *
 * Shown one at a time rather than stacked. Five sections down the page is a wall to scroll and
 * gives nothing to compare against, where swapping one out for another under a fixed heading puts
 * the difference between two states in the same place on screen.
 *
 * Loading is the state a reader meets before any of the others, so it opens on that one.
 *
 * The form is live but harmless. Its board key names no page, so the server refuses the submission
 * before anything is written, which is the same check that guards a real board.
 */
export function ResponsesPreview() {
  const [variant, setVariant] = useState<VariantId>('loading')
  const { total, board } = BOARDS[variant]

  return (
    <div className="space-y-8">
      <SubCategoryFilter categories={VARIANTS} value={variant} onChange={setVariant} />

      <CategoryTransition value={variant} order={VARIANT_ORDER}>
        {/** No post above it here, so the rule that would mark the end of one is left off */}
        <ResponsesSection total={total} showSeparator={false}>
          <MessageBoardForm boardSlug={PREVIEW_SLUG} allowAdminSignIn={false} />
          {board}
        </ResponsesSection>
      </CategoryTransition>
    </div>
  )
}
