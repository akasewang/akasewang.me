'use server'

import { db } from '@/lib/db/drizzle'
import { messageBoard } from '@/lib/db/schema'
import { desc, eq, and, gt } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { toastContent } from '@/data/content/toast-content'
import { MESSAGES_PER_PAGE } from '@/constants/constants'
import type { ActionResult } from '@/types/actions'

const isAdmin = (secret: string) =>
  process.env.ADMIN_PASSWORD && secret === process.env.ADMIN_PASSWORD

/**
 * Server action to submit a new message to the public message board.
 * Includes rate limiting (based on IP) and basic honeypot bot protection.
 *
 * @param formData - The submitted form data containing `name`, `message`, and the hidden `honey` field.
 * @returns An ActionResult indicating success or specific validation/rate-limit errors.
 */
export async function submitMessageBoardMessage(formData: FormData): Promise<ActionResult> {
  const { messageBoard: toasts } = toastContent
  const name = formData.get('name')?.toString().trim()
  const message = formData.get('message')?.toString().trim()

  if (formData.get('honey')) return { success: false, error: toasts.botDetected }
  if (!name || name.length < 2) return { success: false, error: toasts.invalidName }
  if (!message || message.length < 2) return { success: false, error: toasts.invalidMessage }
  if (message.length > 500) return { success: false, error: toasts.messageTooLong }

  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0] || '127.0.0.1'
  const twoMinutesAgo = new Date(Date.now() - 120000)

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
 * Server action to fetch a paginated list of message board entries.
 * Sorted chronologically (newest first). Excludes sensitive fields like IP address.
 *
 * @param offset - The number of records to skip.
 * @param limit - The maximum number of records to return.
 * @returns An ActionResult containing the messages array and a `hasMore` boolean for infinite scroll.
 */
export async function getMessageBoardMessages(
  offset = 0,
  limit = MESSAGES_PER_PAGE,
): Promise<ActionResult<{ messages: any[]; hasMore: boolean }>> {
  try {
    const data = await db.query.messageBoard.findMany({
      columns: { ip: false },
      orderBy: [desc(messageBoard.createdAt)],
      limit: limit + 1,
      offset,
    })

    return {
      success: true,
      data: {
        messages: data.slice(0, limit),
        hasMore: data.length > limit,
      },
    }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Failed to fetch messages' }
  }
}

/**
 * Secure admin server action to permanently delete a specific message board entry by ID.
 *
 * @param id - The database ID of the message to delete.
 * @param adminSecret - The secret password to verify admin privileges.
 * @returns An ActionResult indicating success or authorization failure.
 */
export async function deleteMessageBoardMessage(
  id: number,
  adminSecret: string,
): Promise<ActionResult> {
  if (!isAdmin(adminSecret)) return { success: false, error: toastContent.newsletter.unauthorized }

  try {
    await db.delete(messageBoard).where(eq(messageBoard.id, id))
    revalidatePath('/message-board')
    return { success: true, data: undefined }
  } catch (error) {
    console.error(error)
    return { success: false, error: toastContent.messageBoard.deleteError }
  }
}

/**
 * Secure admin server action to attach an official reply to a user's message board entry.
 *
 * @param id - The database ID of the target message.
 * @param reply - The admin's reply text.
 * @param adminSecret - The secret password to verify admin privileges.
 * @returns An ActionResult indicating success or authorization failure.
 */
export async function replyMessageBoardMessage(
  id: number,
  reply: string,
  adminSecret: string,
): Promise<ActionResult> {
  if (!isAdmin(adminSecret)) return { success: false, error: toastContent.newsletter.unauthorized }

  try {
    await db.update(messageBoard).set({ adminReply: reply }).where(eq(messageBoard.id, id))
    revalidatePath('/message-board')
    return { success: true, data: undefined }
  } catch (error) {
    console.error(error)
    return { success: false, error: toastContent.messageBoard.replyError }
  }
}
