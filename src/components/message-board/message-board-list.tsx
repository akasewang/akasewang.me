'use client'

import { type ReactNode, useCallback, useState } from 'react'
import { toast } from 'sonner'
import { EmptyState } from '@/components/common/empty-state'
import { Icons } from '@/components/ui/icons'
import { LoadButton } from '@/components/ui/load-button'
import { MESSAGES_PER_PAGE } from '@/constants/constants'
import { messageBoardContent as t } from '@/data/content/message-board-content'
import { useAdmin } from '@/hooks/use-admin'
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import {
  deleteMessageBoardMessage,
  getMessageBoardMessages,
  replyMessageBoardMessage,
} from '@/lib/actions/message-board-actions'
import type { MessageBoardEntry } from '@/types/message-board'
import { cn } from '@/utils/utils'
import { MessageBubbles } from './message-bubbles'

interface MessageBoardListProps {
  messages: MessageBoardEntry[] | null
  /** Which board to page through, left out for the site-wide one */
  boardSlug?: string
  pageSize?: number
  /**
   * Whether more exist beyond the page given, where the caller already knows. Left out, it is
   * guessed from the page being full, which is wrong whenever the board holds exactly a page.
   */
  initialHasMore?: boolean
  /**
   * How the next page is asked for. A board that fills its own page can load as the reader reaches
   * the bottom, since there is nothing below it to reach. One sitting inside a page has a footer
   * under it, and loading on scroll would grow the section faster than the reader could pass it, so
   * it waits to be asked.
   */
  paging?: 'scroll' | 'button'
  /** Dropped in where the board is empty, a post's board wanting a quieter line than the page's */
  emptyState?: ReactNode
  /**
   * Told after the owner removes one, for a caller showing a count of its own. Deleting is the only
   * thing here that changes how many there are, a reply going onto a message already counted.
   */
  onDeleted?: () => void
}

const LOADING_PANEL_CLASS = 'bg-surface-40 ring-1 ring-inset ring-ring/80 retina:ring-[0.5px]'

/**
 * The board's messages, newest at the top, older ones loading in as the reader scrolls down.
 *
 * Messages are grouped under the day they were left, and the owner's controls for replying and
 * deleting appear here once signed in.
 */
export function MessageBoardList({
  messages: initialMessages,
  boardSlug,
  pageSize = MESSAGES_PER_PAGE,
  initialHasMore,
  paging = 'scroll',
  emptyState,
  onDeleted,
}: MessageBoardListProps) {
  const { destructive, hoverTick, tap, error: errorSound } = useSoundEffects()
  const { isAdmin, logoutAdmin } = useAdmin()
  const initialMessageList = initialMessages ?? []

  const [messages, setMessages] = useState<MessageBoardEntry[]>(() => initialMessageList)
  const [loading, setLoading] = useState(false)
  /** Told where the caller knows, and otherwise guessed: a full first page means probably another */
  const [hasMore, setHasMore] = useState(initialHasMore ?? initialMessageList.length >= pageSize)
  const [loadError, setLoadError] = useState(false)

  const [syncedInitial, setSyncedInitial] = useState(initialMessages)

  /**
   * Posting revalidates the page, which sends a fresh first page down as a prop. State is seeded
   * once and would otherwise ignore it, leaving a message invisible to whoever just wrote it, so
   * anything newly arrived is folded in. Older pages already scrolled to are left where they are.
   *
   * Done while rendering rather than from an effect, which is how React itself adjusts state to a
   * changed prop: the re-render happens before anything is committed, so nothing paints twice.
   */
  if (initialMessages !== syncedInitial) {
    setSyncedInitial(initialMessages)

    if (initialMessages) {
      setMessages((prev) => {
        const seenIds = new Set(prev.map((message) => message.id))
        const arrived = initialMessages.filter((message) => !seenIds.has(message.id))
        return arrived.length > 0 ? [...arrived, ...prev] : prev
      })
    }
  }

  const handleDelete = useCallback(
    async (id: number) => {
      if (!isAdmin || !window.confirm('Are you sure you want to delete this message?')) return

      destructive()
      /** Removed from the list only once the server has agreed, rather than optimistically */
      const res = await deleteMessageBoardMessage(id, boardSlug ?? null)
      if (res.success) {
        setMessages((prev) => prev.filter((m) => m.id !== id))
        onDeleted?.()
        toast.success('Message deleted')
      } else {
        errorSound()
        toast.error(res.error)
      }
    },
    [isAdmin, destructive, errorSound, boardSlug, onDeleted],
  )

  const handleReply = useCallback(
    async (id: number, text: string) => {
      if (!isAdmin) return false

      const res = await replyMessageBoardMessage(id, text, boardSlug ?? null)
      if (res.success) {
        /** The server's time rather than this browser's, whose clock is not the one of record */
        setMessages((prev) =>
          prev.map((m) =>
            m.id === id ? { ...m, adminReply: text, adminReplyAt: res.data.adminReplyAt } : m,
          ),
        )
        return true
      }

      errorSound()
      toast.error(res.error)
      return false
    },
    [isAdmin, errorSound, boardSlug],
  )

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)
    setLoadError(false)

    try {
      /** Paged from the last id held rather than by offset, so a new message cannot shift the page */
      const lastMessage = messages.at(-1)
      const cursor = lastMessage ? { id: lastMessage.id } : null
      const response = await getMessageBoardMessages(cursor, pageSize, boardSlug ?? null)
      if (!response.success) throw new Error(response.error)

      /** Belt and braces against a duplicate, in case the same page is fetched twice */
      setMessages((prev) => {
        const seenIds = new Set(prev.map((message) => message.id))
        const nextMessages = response.data.messages.filter((message) => !seenIds.has(message.id))
        return [...prev, ...nextMessages]
      })
      setHasMore(response.data.hasMore ?? false)
    } catch {
      setLoadError(true)
    } finally {
      setLoading(false)
    }
  }, [loading, hasMore, messages, pageSize, boardSlug])

  /** Never armed in button mode, so the observer is not watching a target it must not act on */
  const observerTarget = useInfiniteScroll<HTMLDivElement>(
    loadMore,
    paging === 'scroll' && hasMore && !loading && !loadError,
    '400px',
  )

  if (initialMessages === null) {
    return <EmptyState message={t.offline} className="py-20" />
  }

  if (messages.length === 0) {
    return emptyState ?? <EmptyState message={t.noMessagesLabel} className="py-20" />
  }

  const messageElements = messages.map((msg, index) => {
    const msgDate = new Date(msg.createdAt)
    const currentDateString = msgDate.toDateString()
    const previousMessage = messages[index - 1]
    const previousDateString = previousMessage
      ? new Date(previousMessage.createdAt).toDateString()
      : null
    const showDayHeader = previousDateString !== currentDateString

    return (
      <div key={msg.id}>
        <MessageBubbles
          msg={msg}
          msgDate={msgDate}
          showDayHeader={showDayHeader}
          isAdmin={isAdmin}
          onDelete={handleDelete}
          onReply={handleReply}
        />
      </div>
    )
  })

  return (
    <div className="relative">
      {/** Signing out sits with signing in, on the board's own page. Moderation still works here */}
      {isAdmin && !boardSlug && (
        <div className="mb-6 flex justify-end">
          <button
            type="button"
            onClick={() => {
              destructive()
              logoutAdmin()
            }}
            onMouseEnter={hoverTick}
            className="rounded-md bg-destructive/10 px-4 py-2 text-xs font-medium text-destructive transition-[background-color,transform,scale] duration-300 supports-hover:hover:bg-destructive/20 active:bg-destructive/20 active:scale-[0.98] active:duration-200"
          >
            Leave Admin Mode
          </button>
        </div>
      )}

      <div className="space-y-6">{messageElements}</div>

      <div ref={observerTarget} className="flex justify-center py-8">
        {/** The button carries its own loading state, so the floating pill would only repeat it */}
        {paging === 'button' && hasMore && !loadError && (
          <LoadButton
            onLoad={loadMore}
            isLoading={loading}
            label={t.loadMore}
            loadingLabel={t.loadingMore}
          />
        )}

        {paging === 'scroll' && loading && (
          <div
            className={cn(
              'flex items-center gap-3 rounded-full px-4 py-2 text-sm text-muted-foreground',
              LOADING_PANEL_CLASS,
            )}
          >
            <div className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            {t.loadingMore}
          </div>
        )}

        {loadError && !loading && (
          <div className="flex items-center gap-2 text-xs tracking-tight text-muted-foreground/50 duration-300 animate-in fade-in slide-in-from-bottom-2">
            <Icons.wifiOff className="size-3.5 opacity-60" />
            <span>{t.connectionLost}</span>
            <span className="mx-1.5 opacity-30">·</span>
            <button
              type="button"
              onClick={() => {
                tap()
                loadMore()
              }}
              onMouseEnter={hoverTick}
              className="relative underline underline-offset-4 transition-colors duration-300 supports-hover:hover:text-foreground active:text-foreground active:duration-200"
            >
              {t.retry}
            </button>
          </div>
        )}

        {!hasMore && messages.length >= pageSize && !loading && !loadError && (
          <p className="text-balance text-xs text-muted-foreground/50">{t.endOfMessages}</p>
        )}
      </div>
    </div>
  )
}
