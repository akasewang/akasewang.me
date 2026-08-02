'use server'

import { toastContent } from '@/data/content/toast-content'
import { verifyAdminOtp } from '@/lib/admin-otp'
import { endAdminSession, hasAdminSession, startAdminSession } from '@/lib/admin-session'
import type { ActionResult } from '@/types/actions'

/**
 * Trades a correct code for a session. The code is spent here and nowhere else, so it never has to
 * be kept anywhere on the client, and every privileged action after this reads the cookie instead.
 */
export async function signInAdmin(code: string): Promise<ActionResult> {
  if (!(await verifyAdminOtp(code))) {
    return { success: false, error: toastContent.newsletter.unauthorized }
  }

  await startAdminSession()
  return { success: true, data: undefined }
}

export async function signOutAdmin(): Promise<ActionResult> {
  await endAdminSession()
  return { success: true, data: undefined }
}

/** Only decides what the interface offers. Every mutation checks the session again for itself */
export async function checkAdminSession(): Promise<boolean> {
  return await hasAdminSession()
}
