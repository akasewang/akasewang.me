'use client'

import { type ReactNode, useCallback, useEffect, useState } from 'react'
import { SectionTitle } from '@/components/layout/section-title'
import { MessageBoardForm } from '@/components/message-board/message-board-form'
import { MessageBoardList } from '@/components/message-board/message-board-list'
import { IncomingMessageSkeleton, ReplyMessageSkeleton } from '@/components/skeletons/message-board'
import { POST_BOARD_PAGE_SIZE } from '@/constants/constants'
import { messageBoardContent } from '@/data/content/message-board-content'
import { getMessageBoardOverview } from '@/lib/actions/message-board-actions'
import type { MessageBoardEntry } from '@/types/message-board'
import { type BoardScope, boardSlugFor } from '@/utils/message-board-scope'
import { cn } from '@/utils/utils'

const t = messageBoardContent.post

/** Messages are null where the read failed, which the list draws as its offline notice */
type Board = {
  messages: MessageBoardEntry[] | null
  total: number | null
  hasMore: boolean
}

/**
 * Returns what it read rather than setting it, which keeps every state update in the hands of
 * whoever asked for the read and out of the module scope this sits in.
 */
async function readBoard(boardSlug: string): Promise<Board> {
  const overview = await getMessageBoardOverview(boardSlug, POST_BOARD_PAGE_SIZE)

  if (!overview.success) return { messages: null, total: null, hasMore: false }

  const { messages, total, hasMore } = overview.data
  return { messages, total, hasMore }
}

interface PostMessageBoardProps {
  scope: BoardScope
  slug: string
}

/**
 * The board under a post, kept separate from the site-wide one at /message-board.
 *
 * Read on the client rather than with the page. These pages are prerendered, so a board rendered
 * with them would be frozen at build time, and a build without a reachable database would bake the
 * offline notice into every one of them. Fetching here leaves the post itself static and the
 * discussion always current.
 *
 * The owner signs in on the board's own page. The session is a cookie, so moderation works here
 * without this needing a way in of its own.
 */
export function PostMessageBoard({ scope, slug }: PostMessageBoardProps) {
  const boardSlug = boardSlugFor(scope, slug)

  /** Null until the first read lands, which is the whole of what the skeleton stands in for */
  const [board, setBoard] = useState<Board | null>(null)

  useEffect(() => {
    /** Dropped if the reader leaves before the read lands, rather than setting state on the way out */
    let active = true

    readBoard(boardSlug).then((next) => {
      if (active) setBoard(next)
    })

    return () => {
      active = false
    }
  }, [boardSlug])

  /** After a post. The page around this is static, so nothing else brings the new message down */
  const refresh = useCallback(async () => {
    setBoard(await readBoard(boardSlug))
  }, [boardSlug])

  /**
   * The list drops a deleted message itself, so only the count here is left to correct. Adjusted
   * rather than re-read, the answer already being known and a round trip buying nothing.
   */
  const handleDeleted = useCallback(() => {
    setBoard((current) => (current?.total ? { ...current, total: current.total - 1 } : current))
  }, [])

  return (
    /** The gap belongs to what sits above: this is where the post ends and the answers begin */
    <ResponsesSection total={board?.total} className="mt-16">
      <MessageBoardForm boardSlug={boardSlug} allowAdminSignIn={false} onPosted={refresh} />

      {board === null ? (
        <BoardSkeleton />
      ) : (
        <MessageBoardList
          messages={board.messages}
          boardSlug={boardSlug}
          pageSize={POST_BOARD_PAGE_SIZE}
          initialHasMore={board.hasMore}
          paging="button"
          onDeleted={handleDeleted}
          emptyState={<ResponsesEmpty />}
        />
      )}
    </ResponsesSection>
  )
}

/**
 * The section's own furniture: the break from the post above, the heading and the count. Kept apart
 * from the reading of the board so the preview under /dev can draw the real thing rather than a
 * copy of it, which would drift the moment either was touched.
 */
export function ResponsesSection({
  total,
  className,
  showSeparator = true,
  children,
}: {
  total?: number | null
  className?: string
  /**
   * The rule marks where the post above ends and the answers begin, so it is only worth drawing
   * where something actually precedes the section. The preview has nothing above it and turns it off.
   */
  showSeparator?: boolean
  children: ReactNode
}) {
  return (
    <section className={cn('space-y-8', className)}>
      {showSeparator && (
        /** Short and centred. A rule across the full width would cut the page rather than close it */
        <div aria-hidden className="flex justify-center">
          <span className="h-px w-20 bg-border retina:h-[0.5px]" />
        </div>
      )}

      <div className="flex items-baseline justify-between gap-4">
        <SectionTitle>{t.title}</SectionTitle>
        {total ? (
          <span className="shrink-0 font-mono text-2xs lowercase tracking-wider text-muted-foreground/60">
            {t.countLabel(total)}
          </span>
        ) : null}
      </div>

      {children}
    </section>
  )
}

/** Quieter than the board's own page manages, a post having said most of what there is to say */
export function ResponsesEmpty() {
  return <p className="py-10 text-center text-sm text-muted-foreground/60">{t.empty}</p>
}

/**
 * An exchange rather than a list, holding the same shape the board's own page does: a message, an
 * answer to it, then another. Enough to keep the space without promising a particular number.
 */
export function BoardSkeleton() {
  return (
    <div className="space-y-6" aria-hidden>
      <IncomingMessageSkeleton lines={2} />
      <ReplyMessageSkeleton />
      <IncomingMessageSkeleton lines={1} />
    </div>
  )
}
