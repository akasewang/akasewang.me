'use client'

import { memo, useState } from 'react'
import { GradientAvatar } from '@/components/ui/gradient-avatar'
import { TextArea } from '@/components/ui/text-area'
import { FULL_NAME } from '@/constants/constants'
import { messageBoardContent } from '@/data/content/message-board-content'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import type { MessageBoardEntry } from '@/types/message-board'
import { capitalizeName, cn, formatDayLabel, formatTime } from '@/utils/utils'

const t = messageBoardContent.admin
const contentWidthClass = 'max-w-[85%] sm:max-w-[70%]'
const bubbleBaseClass = 'min-w-[150px] px-4 py-3 rounded-2xl ring-1 ring-inset'
const actionBtnClass = 'text-[11px] font-medium transition-colors duration-300 active:duration-200'

type MessageBubblesProps = {
  msg: MessageBoardEntry
  msgDate: Date
  showDayHeader: boolean
  adminKey: string | null
  onDelete: (id: number) => void
  onReply: (id: number, text: string) => Promise<boolean>
}

export const MessageBubbles = memo(
  ({ msg, msgDate, showDayHeader, adminKey, onDelete, onReply }: MessageBubblesProps) => {
    const { tap, clickPop, hoverTick } = useSoundEffects()
    const [isReplying, setIsReplying] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [replyText, setReplyText] = useState(msg.adminReply || '')

    const timeString = formatTime(msgDate)
    const trimmedReply = replyText.trim()
    const isReplyValid = trimmedReply.length > 0

    const handleReplySubmit = async () => {
      if (!isReplyValid || isSubmitting) return

      setIsSubmitting(true)
      try {
        if (await onReply(msg.id, trimmedReply)) {
          setIsReplying(false)
        }
      } finally {
        setIsSubmitting(false)
      }
    }

    const toggleReply = (isOpen: boolean) => {
      setIsReplying(isOpen)
      setReplyText(msg.adminReply || '')
    }

    return (
      <div className="flex flex-col gap-4">
        {showDayHeader && (
          <div className="flex items-center justify-center py-2">
            <span className="rounded-full bg-surface-40 px-3 py-1 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-ring/40">
              {formatDayLabel(msgDate)}
            </span>
          </div>
        )}

        <div className="flex items-start gap-2.5">
          <GradientAvatar name={msg.name} size={32} className="mt-0.5 shrink-0" />
          <div className={cn('flex flex-col items-start', contentWidthClass)}>
            <div className={cn(bubbleBaseClass, 'bg-surface-40 rounded-tl-sm ring-ring/40')}>
              <p className="mb-1 text-xs font-semibold text-muted-foreground">
                {capitalizeName(msg.name)}
              </p>
              <p className="text-pretty break-words text-sm leading-relaxed text-foreground">
                {msg.message}
              </p>
              <p className="mt-1.5 text-right text-[11px] text-muted-foreground/50">{timeString}</p>
            </div>
            {adminKey && (
              <div className="ml-2 mt-1.5 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onDelete(msg.id)
                  }}
                  onMouseEnter={hoverTick}
                  className={cn(
                    actionBtnClass,
                    'text-destructive supports-hover:hover:text-destructive/80 active:text-destructive/80',
                  )}
                >
                  {t.delete}
                </button>
                {!msg.adminReply && !isReplying && (
                  <button
                    type="button"
                    onClick={() => {
                      tap()
                      toggleReply(true)
                    }}
                    onMouseEnter={hoverTick}
                    className={cn(
                      actionBtnClass,
                      'text-foreground supports-hover:hover:text-foreground/80 active:text-foreground/80',
                    )}
                  >
                    {t.reply}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {msg.adminReply && (
          <div className="mt-2 flex items-start justify-end gap-2.5">
            <div className={cn('flex flex-col items-end', contentWidthClass)}>
              <div
                className={cn(
                  bubbleBaseClass,
                  'rounded-tr-sm bg-verified text-white ring-verified/60',
                )}
              >
                <p className="mb-1 text-xs font-medium text-white/80">{FULL_NAME}</p>
                <p className="text-pretty break-words whitespace-pre-wrap text-sm leading-relaxed">
                  {msg.adminReply}
                </p>
                <p className="mt-1.5 text-left text-[11px] text-white/50">{timeString}</p>
              </div>
              {adminKey && !isReplying && (
                <button
                  type="button"
                  onClick={() => {
                    tap()
                    toggleReply(true)
                  }}
                  onMouseEnter={hoverTick}
                  className={cn(
                    actionBtnClass,
                    'mr-2 mt-1.5 text-foreground supports-hover:hover:text-foreground/80 active:text-foreground/80',
                  )}
                >
                  {t.editReply}
                </button>
              )}
            </div>
            <GradientAvatar name={FULL_NAME} size={32} className="mt-0.5 shrink-0" />
          </div>
        )}

        {isReplying && (
          <div className="mt-2 flex justify-end duration-300 animate-in fade-in slide-in-from-top-2">
            <div className={cn('flex w-full flex-col items-end gap-2', contentWidthClass)}>
              <TextArea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="min-h-[60px] px-3 py-2"
                placeholder={t.textareaPlaceholder}
                rows={1}
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    tap()
                    toggleReply(false)
                  }}
                  onMouseEnter={hoverTick}
                  disabled={isSubmitting}
                  className="rounded-md bg-surface-20 ring-1 ring-inset ring-ring/80 retina:ring-[0.5px] px-4 py-1.5 text-xs font-medium text-muted-foreground transition-[color,background-color,box-shadow,transform,scale] duration-300 supports-hover:hover:bg-surface-50 supports-hover:hover:ring-ring active:bg-surface-50 active:ring-ring active:scale-[0.98] active:duration-200 disabled:pointer-events-none disabled:opacity-50"
                >
                  {t.cancel}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    clickPop()
                    handleReplySubmit()
                  }}
                  onMouseEnter={hoverTick}
                  disabled={!isReplyValid || isSubmitting}
                  className="flex items-center gap-2 rounded-md bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground transition-[opacity,transform,scale] duration-300 supports-hover:hover:opacity-90 active:opacity-90 active:scale-[0.98] active:duration-200 disabled:pointer-events-none disabled:opacity-50"
                >
                  {isSubmitting ? t.sending : t.send}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  },
)
MessageBubbles.displayName = 'MessageBubbles'
