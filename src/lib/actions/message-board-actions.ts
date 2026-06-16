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

async function getClientIp() {
  const requestHeaders = await headers()
  const forwardedFor = requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim()
  const realIp = requestHeaders.get('x-real-ip')?.trim()

  return forwardedFor || realIp || '127.0.0.1'
}

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

export async function getMessageBoardMessages(
  cursor?: MessageBoardCursor | null,
  limit = MESSAGES_PER_PAGE,
): Promise<ActionResult<{ messages: MessageBoardEntry[]; hasMore: boolean }>> {
  try {
    const normalizedLimit = normalizeLimit(limit)
    const normalizedCursor = normalizeCursor(cursor)
    const cursorFilter = normalizedCursor ? lt(messageBoard.id, normalizedCursor.id) : undefined

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
  if (!isAdmin(adminSecret)) return { success: false, error: toastContent.newsletter.unauthorized }
  if (!Number.isInteger(id) || id <= 0) {
    return { success: false, error: toastContent.messageBoard.deleteError }
  }

  try {
    await db.delete(messageBoard).where(eq(messageBoard.id, id))
    revalidatePath('/message-board')
    return { success: true, data: undefined }
  } catch (error) {
    console.error(error)
    return { success: false, error: toastContent.messageBoard.deleteError }
  }
}

export async function replyMessageBoardMessage(
  id: number,
  reply: string,
  adminSecret: string,
): Promise<ActionResult> {
  if (!isAdmin(adminSecret)) return { success: false, error: toastContent.newsletter.unauthorized }
  if (!Number.isInteger(id) || id <= 0) {
    return { success: false, error: toastContent.messageBoard.replyError }
  }
  if (typeof reply !== 'string')
    return { success: false, error: toastContent.messageBoard.replyError }

  const trimmedReply = reply.trim()
  if (!trimmedReply) return { success: false, error: toastContent.messageBoard.invalidMessage }
  if (trimmedReply.length > REPLY_MAX_LENGTH) {
    return { success: false, error: toastContent.messageBoard.messageTooLong }
  }

  try {
    await db.update(messageBoard).set({ adminReply: trimmedReply }).where(eq(messageBoard.id, id))
    revalidatePath('/message-board')
    return { success: true, data: undefined }
  } catch (error) {
    console.error(error)
    return { success: false, error: toastContent.messageBoard.replyError }
  }
}
