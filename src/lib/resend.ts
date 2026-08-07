import 'server-only'
import { Resend } from 'resend'

/**
 * Built on first use, so a build without a mail key still succeeds and only the paths that actually
 * send fail.
 */
let resendInstance: Resend | null = null

export function getResend(): Resend {
  if (!resendInstance) {
    if (!process.env.RESEND_API_KEY) throw new Error('Missing RESEND_API_KEY')
    resendInstance = new Resend(process.env.RESEND_API_KEY)
  }
  return resendInstance
}

export const getNewsletterSender = () => process.env.RESEND_NEWSLETTER_EMAIL?.trim() || null
