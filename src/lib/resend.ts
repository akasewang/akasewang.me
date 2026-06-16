import 'server-only'
import { Resend } from 'resend'

let resendInstance: Resend | null = null

export function getResend(): Resend {
  if (!resendInstance) {
    if (!process.env.RESEND_API_KEY) throw new Error('Missing RESEND_API_KEY')
    resendInstance = new Resend(process.env.RESEND_API_KEY)
  }
  return resendInstance
}

export const SENDER_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
