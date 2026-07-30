'use server'

import { and, desc, eq, gt, lt } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { MESSAGES_PER_PAGE } from '@/constants/constants'
import { toastContent } from '@/data/content/toast-content'
import { db } from '@/lib/db/drizzle'
import { messageBoard } from '@/lib/db/schema'
import type { ActionResult } from '@/types/actions'
import type { MessageBoardEntry } from '@/types/message-board'

/**
 * Checked on the server for every privileged action, so the client holding a credential only ever
 * decides what to offer. An unset password fails closed rather than matching an empty secret.
 */
const isAdmin = (secret: unknown) =>
  typeof secret === 'string' &&
  Boolean(process.env.ADMIN_PASSWORD) &&
  secret === process.env.ADMIN_PASSWORD

const MESSAGE_MIN_LENGTH = 2
const MESSAGE_MAX_LENGTH = 500
const NAME_MAX_LENGTH = 80
const REPLY_MAX_LENGTH = 500
const RATE_LIMIT_WINDOW_MS = 120000
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

function validateAdminMutation(
  id: number,
  adminSecret: string,
  errorMessage: string,
): ActionResult | null {
  if (!isAdmin(adminSecret)) return { success: false, error: toastContent.newsletter.unauthorized }
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
 * Reads the forwarded address the platform sets, taking the first hop since anything after it is
 * caller supplied. Only used to space out submissions, never shown or returned.
 */
async function getClientIp() {
  const requestHeaders = await headers()
  const forwardedFor = requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim()
  const realIp = requestHeaders.get('x-real-ip')?.trim()

  return forwardedFor || realIp || '127.0.0.1'
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
  const twoMinutesAgo = new Date(Date.now() - RATE_LIMIT_WINDOW_MS)

  try {
    const lastMessage = await db.query.messageBoard.findFirst({
      where: and(eq(messageBoard.ip, ip), gt(messageBoard.createdAt, twoMinutesAgo)),
    })

    if (lastMessage) return { success: false, error: toasts.rateLimit }

    await db.insert(messageBoard).values({ name, message, ip })
    revalidatePath('/message-board')

    return { success: true, data: undefined }
  } catch (error) {
    console.error(error)
    return { success: false, error: toasts.genericError }
  }
}

/**
 * A page of messages, newest first, keyed on the id cursor rather than an offset so a message
 * arriving mid scroll cannot shift the next page. The stored IP is never selected.
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
      columns: { ip: false },
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

export async function deleteMessageBoardMessage(
  id: number,
  adminSecret: string,
): Promise<ActionResult> {
  const validationError = validateAdminMutation(
    id,
    adminSecret,
    toastContent.messageBoard.deleteError,
  )
  if (validationError) return validationError

  return await runMutation(toastContent.messageBoard.deleteError, async () => {
    await db.delete(messageBoard).where(eq(messageBoard.id, id))
  })
}

export async function replyMessageBoardMessage(
  id: number,
  reply: string,
  adminSecret: string,
): Promise<ActionResult> {
  const validationError = validateAdminMutation(
    id,
    adminSecret,
    toastContent.messageBoard.replyError,
  )
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
