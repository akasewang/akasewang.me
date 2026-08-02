'use client'

import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { EmptyState } from '@/components/common/empty-state'
import { Icons } from '@/components/ui/icons'
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
}

const LOADING_PANEL_CLASS = 'bg-surface-40 ring-1 ring-inset ring-ring/80'

export function MessageBoardList({ messages: initialMessages }: MessageBoardListProps) {
  const { destructive, hoverTick, tap, error: errorSound } = useSoundEffects()
  const { isAdmin, logoutAdmin } = useAdmin()
  const initialMessageList = initialMessages ?? []

  const [messages, setMessages] = useState<MessageBoardEntry[]>(() => initialMessageList)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialMessageList.length >= MESSAGES_PER_PAGE)
  const [loadError, setLoadError] = useState(false)

  const handleDelete = useCallback(
    async (id: number) => {
      if (!isAdmin || !window.confirm('Are you sure you want to delete this message?')) return

      destructive()
      const res = await deleteMessageBoardMessage(id)
      if (res.success) {
        setMessages((prev) => prev.filter((m) => m.id !== id))
        toast.success('Message deleted')
      } else {
        errorSound()
        toast.error(res.error)
      }
    },
    [isAdmin, destructive, errorSound],
  )

  const handleReply = useCallback(
    async (id: number, text: string) => {
      if (!isAdmin) return false

      const res = await replyMessageBoardMessage(id, text)
      if (res.success) {
        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, adminReply: text } : m)))
        return true
      }

      errorSound()
      toast.error(res.error)
      return false
    },
    [isAdmin, errorSound],
  )

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)
    setLoadError(false)

    try {
      const lastMessage = messages.at(-1)
      const cursor = lastMessage ? { id: lastMessage.id } : null
      const response = await getMessageBoardMessages(cursor)
      if (!response.success) throw new Error(response.error)

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
  }, [loading, hasMore, messages])

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

  const messageElements = messages.map((msg, index) => {
    const msgDate = new Date(msg.createdAt)
    const currentDateString = msgDate.toDateString()
    const previousMessage = messages[index - 1]
    const previousDateString = previousMessage
      ? new Date(previousMessage.createdAt).toDateString()
      : null
    const showDayHeader = previousDateString !== currentDateString

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
          isAdmin={isAdmin}
          onDelete={handleDelete}
          onReply={handleReply}
        />
      </div>
    )
  })

  return (
    <div className="relative">
      {isAdmin && (
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
        {loading && (
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

        {!hasMore && messages.length >= MESSAGES_PER_PAGE && !loading && !loadError && (
          <p className="text-balance text-xs text-muted-foreground/50">{t.endOfMessages}</p>
        )}
      </div>
    </div>
  )
}
