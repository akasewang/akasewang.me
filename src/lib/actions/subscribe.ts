'use server'

import { render } from '@react-email/components'
import { eq } from 'drizzle-orm'
import React from 'react'
import { WelcomeTemplate } from '@/components/emails/welcome-template'
import { FULL_NAME } from '@/constants/constants'
import { logContent } from '@/data/content/log-content'
import { toastContent } from '@/data/content/toast-content'
import { db } from '@/lib/db/drizzle'
import { newsletterSubscribers } from '@/lib/db/schema'
import { getResend, SENDER_EMAIL } from '@/lib/resend'
import type { ActionResult } from '@/types/actions'

/** A shape check only. Whether the address exists is settled by the welcome mail arriving */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const MAX_EMAIL_LENGTH = 254

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

  if (!lowerEmail || lowerEmail.length > MAX_EMAIL_LENGTH || !EMAIL_REGEX.test(lowerEmail)) {
    return { success: false, error: toasts.invalidEmail }
  }

  try {
    const existing = await db.query.newsletterSubscribers.findFirst({
      where: eq(newsletterSubscribers.email, lowerEmail),
      columns: { isActive: true, token: true },
    })

    if (existing) {
      if (!existing.isActive) {
        await db
          .update(newsletterSubscribers)
          .set({ isActive: true })
          .where(eq(newsletterSubscribers.email, lowerEmail))

        const htmlContent = await render(
          React.createElement(WelcomeTemplate, {
            unsubscribeToken: existing.token,
            isResubscribe: true,
          }),
        )

        await getResend().emails.send({
          from: `${FULL_NAME} <${SENDER_EMAIL}>`,
          to: lowerEmail,
          subject: 'Welcome Back!',
          html: htmlContent,
        })

        return { success: true, data: { isNew: false } }
      }
      return { success: false, error: toasts.alreadySubscribed }
    }

    const [newUser] = await db
      .insert(newsletterSubscribers)
      .values({ email: lowerEmail })
      .returning({ token: newsletterSubscribers.token })

    const htmlContent = await render(
      React.createElement(WelcomeTemplate, {
        unsubscribeToken: newUser.token,
        isResubscribe: false,
      }),
    )

    await getResend().emails.send({
      from: `${FULL_NAME} <${SENDER_EMAIL}>`,
      to: lowerEmail,
      subject: 'Welcome Aboard!',
      html: htmlContent,
    })

    return { success: true, data: { isNew: true } }
  } catch (err) {
    console.error(logContent.subscribe.error, err instanceof Error ? err.message : err)
    return { success: false, error: toasts.internalError }
  }
}
