'use server'

import { and, count, desc, eq, isNull, lt } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { EMAIL_SHAPE, MESSAGES_PER_PAGE } from '@/constants/constants'
import { MESSAGE_BOARD_COOLDOWN_SECONDS } from '@/constants/rate-limits'
import { toastContent } from '@/data/content/toast-content'
import { hasAdminSession } from '@/lib/admin-session'
import { db } from '@/lib/db/drizzle'
import { messageBoard } from '@/lib/db/schema'
import { isKnownBoardSlug } from '@/lib/message-board-scope'
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

/** Which board is being read or written: a page's key, or null for the site-wide one */
type BoardSlug = string | null

/** Null is a value here rather than an absence, so it needs isNull instead of an equality test */
const boardFilter = (slug: BoardSlug) =>
  slug === null ? isNull(messageBoard.slug) : eq(messageBoard.slug, slug)

/**
 * Only the site-wide board is rendered with its page, so only it needs refreshing after a write. A
 * post's board is fetched by the browser after the page has loaded, and revalidating the post would
 * discard a good static render to rebuild byte-identical HTML.
 */
function refreshBoardPage(slug: BoardSlug) {
  if (slug === null) revalidatePath('/message-board')
}

/**
 * A board key off the wire. Anything unrecognised is refused rather than quietly redirected to the
 * site-wide board, which would file a message on a page nobody was writing to.
 */
async function readBoardSlug(value: FormDataEntryValue | null): Promise<BoardSlug | 'invalid'> {
  if (value === null) return null

  const slug = value.toString().trim()
  if (!slug) return null

  return (await isKnownBoardSlug(slug)) ? slug : 'invalid'
}

/**
 * Both arguments to the read below arrive from the client, so both are bounded here rather than
 * trusted. A nonsense limit falls back to the default and a nonsense cursor reads as no cursor.
 */
function normalizeLimit(limit: number) {
  if (!Number.isFinite(limit)) return MESSAGES_PER_PAGE
  return Math.min(MAX_MESSAGES_PER_PAGE, Math.max(1, Math.floor(limit)))
}

function normalizeCursor(cursor?: MessageBoardCursor | null) {
  if (!cursor || !Number.isInteger(cursor.id) || cursor.id <= 0) return null
  return { id: cursor.id }
}

/** Only ever a refusal or nothing, which is what lets callers return it whatever their own data is */
type ActionFailure = Extract<ActionResult, { success: false }>

/**
 * Checked on the server for every privileged action. The caller passes no credential at all now, so
 * what the browser holds only decides what the interface offers and there is nothing to forge.
 */
async function validateAdminMutation(
  id: number,
  errorMessage: string,
): Promise<ActionFailure | null> {
  if (!(await hasAdminSession())) {
    return { success: false, error: toastContent.newsletter.unauthorized }
  }
  if (!Number.isInteger(id) || id <= 0) return { success: false, error: errorMessage }
  return null
}

/**
 * The shared tail of every admin write: run it, refresh the page, report a failure as a message.
 * Whatever the write hands back is carried through, so a caller that needs a value the database
 * settled can have it without a second read.
 */
async function runMutation<T = void>(
  errorMessage: string,
  boardSlug: BoardSlug,
  mutation: () => Promise<T>,
): Promise<ActionResult<T>> {
  try {
    const data = await mutation()
    refreshBoardPage(boardSlug)
    return { success: true, data }
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

  /** First, since it costs nothing and the board key below is settled by reading the content dir */
  if (formData.get('honey')) return { success: false, error: toasts.botDetected }

  const slug = await readBoardSlug(formData.get('slug'))
  if (slug === 'invalid') return { success: false, error: toasts.genericError }

  if (!name || name.length < MESSAGE_MIN_LENGTH || name.length > NAME_MAX_LENGTH) {
    return { success: false, error: toasts.invalidName }
  }

  /**
   * An address is never a name worth publishing. On the board's own page one means the owner is
   * signing in and never reaches here, and under a post, where no sign in is offered, it would
   * otherwise put somebody's address on a public page for the sake of a mistyped field.
   */
  if (EMAIL_SHAPE.test(name)) return { success: false, error: toasts.invalidName }
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

    await db.insert(messageBoard).values({ name, message, slug })
    refreshBoardPage(slug)

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
  boardSlug: BoardSlug = null,
): Promise<ActionResult<{ messages: MessageBoardEntry[]; hasMore: boolean }>> {
  try {
    const normalizedLimit = normalizeLimit(limit)
    const normalizedCursor = normalizeCursor(cursor)
    const cursorFilter = normalizedCursor ? lt(messageBoard.id, normalizedCursor.id) : undefined

    /**
     * Unvalidated, unlike the write. A key naming no page simply matches no rows, and refusing it
     * would cost a content read on every scroll to prevent an empty list either way.
     */
    const filter = and(boardFilter(boardSlug), cursorFilter)

    /** One more than asked for, which answers hasMore without a second count query */
    const data = await db.query.messageBoard.findMany({
      where: filter,
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

/**
 * How many messages a board holds. Counted rather than taken from the loaded page, which is only
 * ever the first of them, so a board with more than fits would otherwise announce the wrong number.
 *
 * Null where it could not be counted, which the heading reads as nothing to show. The count is a
 * decoration on the messages and must not be able to take them down with it.
 */
async function countBoardMessages(boardSlug: BoardSlug): Promise<number | null> {
  try {
    const [row] = await db
      .select({ total: count() })
      .from(messageBoard)
      .where(boardFilter(boardSlug))

    return row?.total ?? 0
  } catch (error) {
    console.error(error)
    return null
  }
}

/**
 * What a board needs the moment it opens: its first page and its total. Two reads, but one call, a
 * board fetched from the browser otherwise costing two round trips to show one section of a page.
 */
export async function getMessageBoardOverview(
  boardSlug: BoardSlug = null,
  limit = MESSAGES_PER_PAGE,
): Promise<
  ActionResult<{ messages: MessageBoardEntry[]; hasMore: boolean; total: number | null }>
> {
  try {
    const [page, total] = await Promise.all([
      getMessageBoardMessages(null, limit, boardSlug),
      countBoardMessages(boardSlug),
    ])

    if (!page.success) return page

    return { success: true, data: { ...page.data, total } }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Failed to fetch messages' }
  }
}

/**
 * Admin only, as checked inside validateAdminMutation rather than by the caller. The board is named
 * only so the page it appears on is the one refreshed afterwards.
 */
export async function deleteMessageBoardMessage(
  id: number,
  boardSlug: BoardSlug = null,
): Promise<ActionResult> {
  const validationError = await validateAdminMutation(id, toastContent.messageBoard.deleteError)
  if (validationError) return validationError

  return await runMutation(toastContent.messageBoard.deleteError, boardSlug, async () => {
    await db.delete(messageBoard).where(eq(messageBoard.id, id))
  })
}

/**
 * Admin only. One reply per message, so this overwrites rather than appends, and an edit is stamped
 * with the time of the edit since that is the version now on the board.
 */
export async function replyMessageBoardMessage(
  id: number,
  reply: string,
  boardSlug: BoardSlug = null,
): Promise<ActionResult<{ adminReplyAt: Date | null }>> {
  const validationError = await validateAdminMutation(id, toastContent.messageBoard.replyError)
  if (validationError) return validationError

  if (typeof reply !== 'string')
    return { success: false, error: toastContent.messageBoard.replyError }

  const trimmedReply = reply.trim()
  if (!trimmedReply) return { success: false, error: toastContent.messageBoard.invalidMessage }
  if (trimmedReply.length > REPLY_MAX_LENGTH) {
    return { success: false, error: toastContent.messageBoard.messageTooLong }
  }

  return await runMutation(toastContent.messageBoard.replyError, boardSlug, async () => {
    /** Returned rather than assumed, so the board shows the time the row actually holds */
    const [updated] = await db
      .update(messageBoard)
      .set({ adminReply: trimmedReply, adminReplyAt: new Date() })
      .where(eq(messageBoard.id, id))
      .returning({ adminReplyAt: messageBoard.adminReplyAt })

    /** Nothing matched, so the message went between the board being read and this being sent */
    if (!updated) throw new Error(`No message board row with id ${id}`)

    return { adminReplyAt: updated.adminReplyAt }
  })
}
