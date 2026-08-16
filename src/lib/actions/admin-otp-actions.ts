'use server'

import React from 'react'
import { render } from 'react-email'
import { OtpTemplate } from '@/components/emails/otp-template'
import { FULL_NAME } from '@/constants/constants'
import { toastContent } from '@/data/content/toast-content'
import {
  adminRecipient,
  isAdminAddress,
  issueAdminOtp,
  OTP_MAX_ATTEMPTS,
  OTP_TTL_MINUTES,
  otpSender,
} from '@/lib/admin-otp'
import { getResend } from '@/lib/resend'
import type { ActionResult } from '@/types/actions'

/**
 * Mails a fresh admin code to the address held on the server, which is also the address the caller
 * has to name before anything is sent. The code only ever goes to the stored address, so naming it
 * correctly still leaves a caller with nothing to read unless they hold the inbox too.
 *
 * The address is matched in constant time and a new code cannot be asked for more than once a
 * minute, which is what stops the form being worked at speed.
 */
export async function requestAdminOtp(email: string): Promise<ActionResult> {
  const toasts = toastContent.newsletter
  const recipient = adminRecipient()
  const sender = otpSender()

  if (!recipient) return { success: false, error: toasts.otpUnavailable }
  if (!sender) return { success: false, error: toasts.otpSenderUnavailable }

  /**
   * Typed as a string, but this is a server action and the type is a claim about the caller rather
   * than a guarantee about the request. The check is on the type rather than on truthiness so a
   * value that is neither missing nor a string is turned away here instead of reaching trim and
   * throwing, which is also what isAdminAddress does with the same value further down.
   */
  if (typeof email !== 'string' || !email.trim()) {
    return { success: false, error: toasts.otpEmailRequired }
  }

  if (!isAdminAddress(email)) {
    return { success: false, error: toasts.otpEmailInvalid }
  }

  try {
    const issued = await issueAdminOtp()
    if ('retryInSeconds' in issued) {
      return {
        success: false,
        error: `Please wait ${issued.retryInSeconds}s before requesting a new code`,
      }
    }
    if (!('code' in issued)) {
      return { success: false, error: toasts.otpSendFailed }
    }

    const htmlContent = await render(
      React.createElement(OtpTemplate, {
        code: issued.code,
        expiresInMinutes: OTP_TTL_MINUTES,
        maxAttempts: OTP_MAX_ATTEMPTS,
      }),
    )

    const fromAddress = sender.includes('<') ? sender : `${FULL_NAME} <${sender}>`

    const { error } = await getResend().emails.send({
      from: fromAddress,
      to: recipient,
      subject: `${issued.code} is your admin code`,
      html: htmlContent,
    })

    if (error) {
      console.error('Admin code email send failed:', error.message)
      return { success: false, error: toasts.otpSendFailed }
    }

    return { success: true, data: undefined }
  } catch (error) {
    console.error('Admin code request failed:', error instanceof Error ? error.message : error)
    return { success: false, error: toasts.otpSendFailed }
  }
}
