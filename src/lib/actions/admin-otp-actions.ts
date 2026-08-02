'use server'

import { render } from '@react-email/components'
import React from 'react'
import { OtpTemplate } from '@/components/emails/otp-template'
import { FULL_NAME } from '@/constants/constants'
import { toastContent } from '@/data/content/toast-content'
import {
  isAdminAddress,
  issueAdminOtp,
  OTP_MAX_ATTEMPTS,
  OTP_TTL_MINUTES,
  otpRecipient,
} from '@/lib/admin-otp'
import { getResend, SENDER_EMAIL } from '@/lib/resend'
import type { ActionResult } from '@/types/actions'

/**
 * Mails a fresh admin code to the address held on the server, which is also the address the caller
 * has to name before anything happens.
 *
 * Every outcome that is not a misconfiguration answers with one line, and that is the whole point of
 * the gate. A wrong address, a right address, a code already sitting in the inbox and a request made
 * too soon are indistinguishable from out here, so the form cannot be used to find the address by
 * watching what it says back. The line stays true in all of them: where a code is not sent it is
 * because one is already there.
 */
export async function requestAdminOtp(email: string): Promise<ActionResult> {
  const toasts = toastContent.newsletter
  const recipient = otpRecipient()

  /**
   * Answered before the address is looked at, so it says nothing about which address is right. It is
   * a fault in the deployment rather than a fact about the credential, and the owner has to see it.
   */
  if (!recipient) return { success: false, error: toasts.otpUnavailable }

  if (!isAdminAddress(email)) return { success: true, data: undefined }

  try {
    const issued = await issueAdminOtp()
    if (!('code' in issued)) return { success: true, data: undefined }

    const htmlContent = await render(
      React.createElement(OtpTemplate, {
        code: issued.code,
        expiresInMinutes: OTP_TTL_MINUTES,
        maxAttempts: OTP_MAX_ATTEMPTS,
      }),
    )

    await getResend().emails.send({
      from: `${FULL_NAME} <${SENDER_EMAIL}>`,
      to: recipient,
      subject: `${issued.code} is your admin code`,
      html: htmlContent,
    })

    return { success: true, data: undefined }
  } catch (error) {
    /**
     * Logged rather than reported. Nothing past the address check is reachable with a wrong address,
     * so a failure surfaced here would only ever be seen by someone who had guessed right, and a
     * provider having a bad minute would be enough to confirm the guess. The owner learns of it from
     * the code never arriving, and from this line in the server log.
     */
    console.error('Admin code request failed:', error instanceof Error ? error.message : error)
    return { success: true, data: undefined }
  }
}
