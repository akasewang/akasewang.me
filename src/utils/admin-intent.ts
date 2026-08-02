import { ADMIN_CODE_SHAPE, EMAIL_SHAPE } from '@/constants/constants'

type AdminIntent = 'post' | 'sendCode' | 'awaitCode' | 'signIn'

/**
 * What the two message-board fields are asking for. The button label and the submit both come
 * through here, so the button cannot offer one thing while submitting does another.
 *
 * The address belongs in the name field and the code belongs in the message field. A bare code only
 * counts after one has actually been requested from this browser, since an ordinary eight-character
 * message can otherwise have the same shape and accidentally spend an attempt on the live code.
 */
export function adminIntent(
  name: string,
  message: string,
  awaitingCode: boolean,
): { intent: AdminIntent; argument: string } {
  const trimmedName = name.trim()
  const trimmedMessage = message.trim()
  const hasAdminAddressShape = EMAIL_SHAPE.test(trimmedName)

  if (awaitingCode && hasAdminAddressShape) {
    if (ADMIN_CODE_SHAPE.test(trimmedMessage)) {
      return { intent: 'signIn', argument: trimmedMessage }
    }

    return { intent: 'awaitCode', argument: '' }
  }

  if (hasAdminAddressShape) return { intent: 'sendCode', argument: trimmedName }

  return { intent: 'post', argument: '' }
}
