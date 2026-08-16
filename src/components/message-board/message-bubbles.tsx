'use client'

import { memo, useState } from 'react'
import {
  BUBBLE_BASE_CLASS,
  BUBBLE_WIDTH_CLASS,
  REPLY_ROW_CLASS,
} from '@/components/skeletons/message-board'
import { GradientAvatar } from '@/components/ui/gradient-avatar'
import { TextArea } from '@/components/ui/text-area'
import { FULL_NAME } from '@/constants/constants'
import { messageBoardContent } from '@/data/content/message-board-content'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import type { MessageBoardEntry } from '@/types/message-board'
import { capitalizeName, cn, formatDayLabel, formatTime } from '@/utils/utils'

const t = messageBoardContent.admin

const actionBtnClass = 'text-2xs font-medium transition-colors duration-300 active:duration-200'

/** Quieter than the send beside it, cancelling being the choice that should not draw the eye */
const cancelBtnClass =
  'rounded-md bg-surface-20 ring-1 ring-inset ring-ring/80 retina:ring-[0.5px] px-4 py-1.5 text-xs font-medium text-muted-foreground transition-[color,background-color,box-shadow,transform,scale] duration-300 supports-hover:hover:bg-surface-50 supports-hover:hover:ring-ring active:bg-surface-50 active:ring-ring active:scale-[0.98] active:duration-200 disabled:pointer-events-none disabled:opacity-50'

type MessageBubblesProps = {
  msg: MessageBoardEntry
  msgDate: Date
  showDayHeader: boolean
  isAdmin: boolean
  onDelete: (id: number) => void
  onReply: (id: number, text: string) => Promise<boolean>
}

/**
 * What the reply bubble is stamped with: its own time, carrying the day as well where the answer
 * came on a later one, since a bare time would then read as the message's. A reply written before
 * that time was kept has none, so it falls back to the message's stamp rather than showing nothing.
 */
function replyStamp(replyAt: MessageBoardEntry['adminReplyAt'], msgDate: Date, fallback: string) {
  if (!replyAt) return fallback

  const replyDate = new Date(replyAt)
  if (Number.isNaN(replyDate.getTime())) return fallback
  if (replyDate.toDateString() === msgDate.toDateString()) return formatTime(replyDate)

  return `${formatDayLabel(replyDate)} · ${formatTime(replyDate)}`
}

/** One message and the owner's reply beneath it, drawn as a short exchange */
export const MessageBubbles = memo(
  ({ msg, msgDate, showDayHeader, isAdmin, onDelete, onReply }: MessageBubblesProps) => {
    const { tap, clickPop, hoverTick } = useSoundEffects()
    const [isReplying, setIsReplying] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [replyText, setReplyText] = useState(msg.adminReply || '')

    const timeString = formatTime(msgDate)
    const replyTimeString = replyStamp(msg.adminReplyAt, msgDate, timeString)
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

    /** Opening or cancelling both reset the draft to whatever reply is actually saved */
    const toggleReply = (isOpen: boolean) => {
      setIsReplying(isOpen)
      setReplyText(msg.adminReply || '')
    }

    return (
      <div className="flex flex-col gap-4">
        {/** Only the first message of a day carries its date, as a chat would */}
        {showDayHeader && (
          <div className="flex items-center justify-center py-2">
            <span className="rounded-full bg-surface-40 px-3 py-1 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-ring/40 retina:ring-[0.5px]">
              {formatDayLabel(msgDate)}
            </span>
          </div>
        )}

        <div className="flex items-start gap-2.5">
          <GradientAvatar name={msg.name} size={32} className="mt-0.5 shrink-0" />
          <div className={cn('flex flex-col items-start', BUBBLE_WIDTH_CLASS)}>
            <div className={cn(BUBBLE_BASE_CLASS, 'bg-surface-40 rounded-tl-sm ring-ring/40')}>
              <p className="mb-1 text-xs font-semibold text-muted-foreground">
                {capitalizeName(msg.name)}
              </p>
              {/**
               * No pre-wrap here, unlike the reply below. A visitor's line breaks are collapsed,
               * since 500 characters of them would otherwise stretch the page by several screens.
               * The reply is written by the owner, so it is trusted to keep its shape.
               */}
              <p className="text-pretty break-words text-sm leading-relaxed text-foreground">
                {msg.message}
              </p>
              <p className="mt-1.5 text-right text-2xs text-muted-foreground/50">{timeString}</p>
            </div>
            {isAdmin && (
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
          <div className={REPLY_ROW_CLASS}>
            <div className={cn('flex flex-col items-end', BUBBLE_WIDTH_CLASS)}>
              <div
                className={cn(
                  BUBBLE_BASE_CLASS,
                  'rounded-tr-sm bg-verified text-white ring-verified/60',
                )}
              >
                <p className="mb-1 text-xs font-medium text-white/80">{FULL_NAME}</p>
                <p className="text-pretty break-words whitespace-pre-wrap text-sm leading-relaxed">
                  {msg.adminReply}
                </p>
                <p className="mt-1.5 text-left text-2xs text-white/50">{replyTimeString}</p>
              </div>
              {isAdmin && !isReplying && (
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
            <div className={cn('flex w-full flex-col items-end gap-2', BUBBLE_WIDTH_CLASS)}>
              <TextArea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="min-h-15 px-3 py-2"
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
                  className={cancelBtnClass}
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
