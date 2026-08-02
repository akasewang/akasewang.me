'use server'

import { render } from '@react-email/components'
import { and, eq } from 'drizzle-orm'
import React from 'react'
import { WelcomeTemplate } from '@/components/emails/welcome-template'
import { EMAIL_SHAPE, FULL_NAME } from '@/constants/constants'
import { SUBSCRIBE_COOLDOWN_SECONDS } from '@/constants/rate-limits'
import { logContent } from '@/data/content/log-content'
import { toastContent } from '@/data/content/toast-content'
import { db } from '@/lib/db/drizzle'
import { newsletterSubscribers } from '@/lib/db/schema'
import { claimRateLimit } from '@/lib/rate-limit'
import { getClientIp } from '@/lib/request-ip'
import { getResend, SENDER_EMAIL } from '@/lib/resend'
import type { ActionResult } from '@/types/actions'

const MAX_EMAIL_LENGTH = 254

/**
 * The countdown on the form is a courtesy to whoever is looking at it, not a control: this is a
 * server action and anything can call it directly. Without a limit here a loop could burn the mail
 * quota and, worse, send unasked for mail to any address it liked from this domain, which is the
 * sort of thing that costs a sending reputation.
 */
/**
 * The row is written before this runs, and the subscription is the thing the reader actually asked
 * for, so a mail provider having a bad minute does not undo it. Reporting the failure upward would
 * tell them the signup did not work while they are on the list, and their retry could then only
 * answer that they are already subscribed.
 */
async function sendWelcomeEmail(email: string, token: string, isResubscribe: boolean) {
  try {
    const htmlContent = await render(
      React.createElement(WelcomeTemplate, { unsubscribeToken: token, isResubscribe }),
    )

    await getResend().emails.send({
      from: `${FULL_NAME} <${SENDER_EMAIL}>`,
      to: email,
      subject: isResubscribe ? 'Welcome Back!' : 'Welcome Aboard!',
      html: htmlContent,
    })
  } catch (err) {
    console.error(logContent.subscribe.error, err instanceof Error ? err.message : err)
  }
}

/**
 * Adds an address to the newsletter and sends the welcome mail. A previously unsubscribed address is
 * reactivated and keeps its original token, so older unsubscribe links in their inbox still work.
 * The returned flag lets the caller word its confirmation for a new or a returning subscriber.
 */
export async function subscribeAction(email: string): Promise<ActionResult<{ isNew: boolean }>> {
  const toasts = toastContent.subscribe
  if (typeof email !== 'string') {
    return { success: false, error: toasts.invalidEmail }
  }

  const lowerEmail = email.trim().toLowerCase()

  if (!lowerEmail || lowerEmail.length > MAX_EMAIL_LENGTH || !EMAIL_SHAPE.test(lowerEmail)) {
    return { success: false, error: toasts.invalidEmail }
  }

  try {
    const ip = await getClientIp()

    /**
     * Checked before the address is looked up, so every path is spaced out rather than only the one
     * that inserts. Answering at the same rate whatever the address turns out to be also stops the
     * form being used to work out who is already on the list.
     */
    const rateLimit = await claimRateLimit('newsletter-subscribe', ip, SUBSCRIBE_COOLDOWN_SECONDS)
    if (!rateLimit.allowed) {
      return {
        success: false,
        error: toasts.wait,
        retryAfterSeconds: rateLimit.retryAfterSeconds,
      }
    }

    const existing = await db.query.newsletterSubscribers.findFirst({
      where: eq(newsletterSubscribers.email, lowerEmail),
      columns: { isActive: true },
    })

    if (existing) {
      if (existing.isActive) return { success: false, error: toasts.alreadySubscribed }

      /**
       * The inactive predicate makes the transition and its welcome email single-winner even when
       * the same address is reactivated concurrently from different networks.
       */
      const [reactivated] = await db
        .update(newsletterSubscribers)
        .set({ isActive: true, createdAt: new Date() })
        .where(
          and(
            eq(newsletterSubscribers.email, lowerEmail),
            eq(newsletterSubscribers.isActive, false),
          ),
        )
        .returning({ token: newsletterSubscribers.token })

      if (!reactivated) return { success: false, error: toasts.alreadySubscribed }

      await sendWelcomeEmail(lowerEmail, reactivated.token, true)
      return { success: true, data: { isNew: false } }
    }

    const [newUser] = await db
      .insert(newsletterSubscribers)
      .values({ email: lowerEmail })
      .onConflictDoNothing()
      .returning({ token: newsletterSubscribers.token })

    /**
     * Nothing came back, so a second request inserted this address between the read above and this
     * write. Without the conflict clause that collision would raise a primary key violation and be
     * caught below as an internal error, which is not what happened.
     */
    if (!newUser) return { success: false, error: toasts.alreadySubscribed }

    await sendWelcomeEmail(lowerEmail, newUser.token, false)
    return { success: true, data: { isNew: true } }
  } catch (err) {
    console.error(logContent.subscribe.error, err instanceof Error ? err.message : err)
    return { success: false, error: toasts.internalError }
  }
}
