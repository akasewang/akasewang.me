'use server'

import { db } from '@/lib/db/drizzle'
import { newsletterSubscribers } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { toastContent } from '@/data/content/toast-content'
import { logContent } from '@/data/content/log-content'
import { render } from '@react-email/components'
import { getResend, SENDER_EMAIL } from '@/lib/resend'
import { WelcomeTemplate } from '@/components/emails/welcome-template'
import React from 'react'
import { FULL_NAME } from '@/constants/constants'
import type { ActionResult } from '@/types/actions'

/** Basic email shape validation for subscription input. */
const EMAIL_REGEX = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/

/**
 * Server action to handle newsletter subscriptions.
 * Verifies email validity and checks against existing database records to prevent duplicates.
 * Handles resubscriptions and automatically dispatches React Email welcome templates via Resend.
 *
 * @param email - The raw string email address submitted from the client.
 * @returns An ActionResult containing either a success state with boolean `isNew` flag, or an error message string.
 */
export async function subscribeAction(email: string): Promise<ActionResult<{ isNew: boolean }>> {
  const toasts = toastContent.subscribe

  if (!email || !EMAIL_REGEX.test(email)) {
    return { success: false, error: toasts.invalidEmail }
  }

  const lowerEmail = email.trim().toLowerCase()

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
