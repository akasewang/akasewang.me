'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAdmin } from '@/hooks/use-admin'
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll'
import { messageBoardContent as t } from '@/data/content/message-board-content'
import {
  getMessageBoardMessages,
  deleteMessageBoardMessage,
  replyMessageBoardMessage,
} from '@/lib/actions/message-board-actions'
import type { MessageBoardEntry } from '@/types/message-board'
import { MessageBubbles } from './message-bubbles'
import { Icons } from '@/components/ui/icons'
import { EmptyState } from '@/components/common/empty-state'
import { toast } from 'sonner'
import { MESSAGES_PER_PAGE } from '@/constants/constants'
import { cn } from '@/utils/utils'

interface MessageBoardListProps {
  messages: MessageBoardEntry[] | null
}

const GLASS_PANEL_CLASS = 'bg-muted/40 backdrop-blur-md ring-1 ring-inset ring-ring/80'

/**
 * A client-side infinite-scrolling list that displays message board entries.
 * Manages admin state to allow real-time deletion and replying to messages if authenticated.
 * Subscribes to realtime updates (or polls) to dynamically insert new messages.
 *
 * @param messages - The initial array of messages pre-fetched by the server component.
 */
export function MessageBoardList({ messages: initialMessages }: MessageBoardListProps) {
  const { adminKey, logoutAdmin } = useAdmin()

  const [messages, setMessages] = useState<MessageBoardEntry[]>(initialMessages || [])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState((initialMessages?.length || 0) >= MESSAGES_PER_PAGE)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    if (initialMessages) {
      setMessages(initialMessages)
      setHasMore(initialMessages.length >= MESSAGES_PER_PAGE)
    }
  }, [initialMessages])

  const handleDelete = useCallback(
    async (id: number) => {
      if (!adminKey || !window.confirm('Are you sure you want to delete this message?')) return

      const res = await deleteMessageBoardMessage(id, adminKey)
      if (res.success) {
        setMessages((prev) => prev.filter((m) => m.id !== id))
        toast.success('Message deleted')
      } else {
        toast.error(res.error)
      }
    },
    [adminKey],
  )

  const handleReply = useCallback(
    async (id: number, text: string) => {
      if (!adminKey) return false

      const res = await replyMessageBoardMessage(id, text, adminKey)
      if (res.success) {
        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, adminReply: text } : m)))
        return true
      }

      toast.error(res.error)
      return false
    },
    [adminKey],
  )

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)
    setLoadError(false)

    try {
      const response = await getMessageBoardMessages(messages.length)
      if (!response.success) throw new Error(response.error)

      setMessages((prev) => [...prev, ...response.data.messages])
      setHasMore(response.data.hasMore ?? false)
    } catch {
      setLoadError(true)
    } finally {
      setLoading(false)
    }
  }, [loading, hasMore, messages.length])

  const observerTarget = useInfiniteScroll<HTMLDivElement>(
    loadMore,
    hasMore && !loading && !loadError,
    '400px',
  )

  if (initialMessages === null) {
    return <EmptyState message={t.offline} className="py-20" />
  }

  if (messages.length === 0) {
    return <EmptyState message={t.noMessagesLabel} className="py-20" />
  }

  let prevDateString: string | null = null

  const messageElements = messages.map((msg, index) => {
    const msgDate = new Date(msg.createdAt)
    const currentDateString = msgDate.toDateString()
    const showDayHeader = prevDateString !== currentDateString

    prevDateString = currentDateString

    return (
      <div
        key={msg.id}
        className="animate-page-simple"
        style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
      >
        <MessageBubbles
          msg={msg}
          msgDate={msgDate}
          showDayHeader={showDayHeader}
          adminKey={adminKey}
          onDelete={handleDelete}
          onReply={handleReply}
        />
      </div>
    )
  })

  return (
    <div className="relative">
      {adminKey && (
        <div className="mb-6 flex justify-end">
          <button
            onClick={logoutAdmin}
            className="rounded-md bg-destructive/10 px-4 py-2 text-xs font-medium text-destructive transition duration-300 hover:bg-destructive/20 active:scale-[0.98] active:duration-200"
          >
            Leave Admin Mode
          </button>
        </div>
      )}

      <div className="space-y-6">{messageElements}</div>

      <div ref={observerTarget} className="flex justify-center py-8">
        {loading && (
          <div
            className={cn(
              'flex items-center gap-3 rounded-full px-4 py-2 text-sm text-muted-foreground',
              GLASS_PANEL_CLASS,
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
              onClick={() => setLoadError(false)}
              className="relative underline underline-offset-4 transition-colors duration-300 hover:text-foreground active:duration-200"
            >
              {t.retry}
            </button>
          </div>
        )}

        {!hasMore && messages.length >= MESSAGES_PER_PAGE && !loading && !loadError && (
          <p className="text-balance text-xs text-muted-foreground/50">{t.endOfMessages}</p>
        )}
      </div>
    </div>
  )
}
