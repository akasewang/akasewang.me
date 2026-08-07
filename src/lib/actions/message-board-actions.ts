'use server'

import { desc, eq, lt } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { MESSAGES_PER_PAGE } from '@/constants/constants'
import { MESSAGE_BOARD_COOLDOWN_SECONDS } from '@/constants/rate-limits'
import { toastContent } from '@/data/content/toast-content'
import { hasAdminSession } from '@/lib/admin-session'
import { db } from '@/lib/db/drizzle'
import { messageBoard } from '@/lib/db/schema'
import { claimRateLimit } from '@/lib/rate-limit'
import { getClientIp } from '@/lib/request-ip'
import type { ActionResult } from '@/types/actions'
import type { MessageBoardEntry } from '@/types/message-board'

const MESSAGE_MIN_LENGTH = 2
const MESSAGE_MAX_LENGTH = 500
const NAME_MAX_LENGTH = 80
const REPLY_MAX_LENGTH = 500
const MAX_MESSAGES_PER_PAGE = 50

type MessageBoardCursor = Pick<MessageBoardEntry, 'id'>

function normalizeLimit(limit: number) {
  if (!Number.isFinite(limit)) return MESSAGES_PER_PAGE
  return Math.min(MAX_MESSAGES_PER_PAGE, Math.max(1, Math.floor(limit)))
}

function normalizeCursor(cursor?: MessageBoardCursor | null) {
  if (!cursor || !Number.isInteger(cursor.id) || cursor.id <= 0) return null
  return { id: cursor.id }
}

/**
 * Checked on the server for every privileged action. The caller passes no credential at all now, so
 * what the browser holds only decides what the interface offers and there is nothing to forge.
 */
async function validateAdminMutation(
  id: number,
  errorMessage: string,
): Promise<ActionResult | null> {
  if (!(await hasAdminSession())) {
    return { success: false, error: toastContent.newsletter.unauthorized }
  }
  if (!Number.isInteger(id) || id <= 0) return { success: false, error: errorMessage }
  return null
}

async function runMutation(
  errorMessage: string,
  mutation: () => Promise<void>,
): Promise<ActionResult> {
  try {
    await mutation()
    revalidatePath('/message-board')
    return { success: true, data: undefined }
  } catch (error) {
    console.error(error)
    return { success: false, error: errorMessage }
  }
}

/**
 * Validates and stores a public message. The honeypot field catches the bots that fill in every
 * input, and one message per address per window keeps the board usable without asking anyone to
 * sign in. Everything is bounded before it reaches the table.
 */
export async function submitMessageBoardMessage(formData: FormData): Promise<ActionResult> {
  const { messageBoard: toasts } = toastContent
  const name = formData.get('name')?.toString().trim()
  const message = formData.get('message')?.toString().trim()

  if (formData.get('honey')) return { success: false, error: toasts.botDetected }
  if (!name || name.length < MESSAGE_MIN_LENGTH || name.length > NAME_MAX_LENGTH) {
    return { success: false, error: toasts.invalidName }
  }
  if (!message || message.length < MESSAGE_MIN_LENGTH) {
    return { success: false, error: toasts.invalidMessage }
  }
  if (message.length > MESSAGE_MAX_LENGTH) return { success: false, error: toasts.messageTooLong }

  const ip = await getClientIp()

  try {
    const rateLimit = await claimRateLimit('message-board-post', ip, MESSAGE_BOARD_COOLDOWN_SECONDS)
    if (!rateLimit.allowed) {
      return {
        success: false,
        error: toasts.rateLimit,
        retryAfterSeconds: rateLimit.retryAfterSeconds,
      }
    }

    await db.insert(messageBoard).values({ name, message })
    revalidatePath('/message-board')

    return { success: true, data: undefined }
  } catch (error) {
    console.error(error)
    return { success: false, error: toasts.genericError }
  }
}

/**
 * A page of messages, newest first, keyed on the id cursor rather than an offset so a message
 * arriving mid scroll cannot shift the next page.
 */
export async function getMessageBoardMessages(
  cursor?: MessageBoardCursor | null,
  limit = MESSAGES_PER_PAGE,
): Promise<ActionResult<{ messages: MessageBoardEntry[]; hasMore: boolean }>> {
  try {
    const normalizedLimit = normalizeLimit(limit)
    const normalizedCursor = normalizeCursor(cursor)
    const cursorFilter = normalizedCursor ? lt(messageBoard.id, normalizedCursor.id) : undefined

    /** One more than asked for, which answers hasMore without a second count query */
    const data = await db.query.messageBoard.findMany({
      where: cursorFilter,
      orderBy: [desc(messageBoard.id)],
      limit: normalizedLimit + 1,
    })

    return {
      success: true,
      data: {
        messages: data.slice(0, normalizedLimit),
        hasMore: data.length > normalizedLimit,
      },
    }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Failed to fetch messages' }
  }
}

export async function deleteMessageBoardMessage(id: number): Promise<ActionResult> {
  const validationError = await validateAdminMutation(id, toastContent.messageBoard.deleteError)
  if (validationError) return validationError

  return await runMutation(toastContent.messageBoard.deleteError, async () => {
    await db.delete(messageBoard).where(eq(messageBoard.id, id))
  })
}

export async function replyMessageBoardMessage(id: number, reply: string): Promise<ActionResult> {
  const validationError = await validateAdminMutation(id, toastContent.messageBoard.replyError)
  if (validationError) return validationError

  if (typeof reply !== 'string')
    return { success: false, error: toastContent.messageBoard.replyError }

  const trimmedReply = reply.trim()
  if (!trimmedReply) return { success: false, error: toastContent.messageBoard.invalidMessage }
  if (trimmedReply.length > REPLY_MAX_LENGTH) {
    return { success: false, error: toastContent.messageBoard.messageTooLong }
  }

  return await runMutation(toastContent.messageBoard.replyError, async () => {
    await db.update(messageBoard).set({ adminReply: trimmedReply }).where(eq(messageBoard.id, id))
  })
}
