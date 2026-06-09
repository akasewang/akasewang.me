'use client'

import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { Input } from '@/components/ui/input'
import { TextArea } from '@/components/ui/text-area'
import { messageBoardContent as mbContent } from '@/data/content/message-board-content'
import { toastContent } from '@/data/content/toast-content'
import { useAdmin } from '@/hooks/use-admin'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import { useStatusTimer } from '@/hooks/use-status-timer'
import { submitMessageBoardMessage } from '@/lib/actions/message-board-actions'

/** Secret message that, when posted, logs the admin out instead of submitting. */
const ADMIN_LOGOUT_COMMAND = process.env.NEXT_PUBLIC_ADMIN_LOGOUT_COMMAND || '/logout'
/** Secret prefix (`/admin <password>`) that authenticates an admin instead of posting. */
const ADMIN_LOGIN_PREFIX = process.env.NEXT_PUBLIC_ADMIN_LOGIN_PREFIX || '/admin '
const mbToast = toastContent.messageBoard

/**
 * A client side form component for submitting messages to the message board.
 * Includes built in honeypot spam protection, rate limiting countdowns,
 * and secret admin command parsing (`/admin password`, `/logout`).
 *
 * @returns A fully interactive form with animated submission states.
 */
export function MessageBoardForm() {
  const [isPending, setIsPending] = useState(false)
  const { success, countdown, startCountdown, showError, resetStatus } =
    useStatusTimer('message-board')
  const { error: errorSound, success: successSound, destructive } = useSoundEffects()
  const { loginAdmin, logoutAdmin } = useAdmin()
  const formRef = useRef<HTMLFormElement>(null)

  const isDisabled = isPending || countdown > 0

  const handleAdminCommand = (message: string, playSound: () => void) => {
    formRef.current?.reset()
    playSound()
    toast.success(message)
  }

  async function action(formData: FormData) {
    const trimmedMessage = (formData.get('message') as string)?.trim() || ''

    /**
     * Parse the submission for secret admin commands.
     * If the message matches the logout command (e.g., '/logout'), clear the admin cookie
     * and abort the database submission.
     */
    if (trimmedMessage === ADMIN_LOGOUT_COMMAND) {
      logoutAdmin()
      return handleAdminCommand(mbToast.adminLogout, destructive)
    }

    /**
     * If the message starts with the admin login prefix (e.g., '/admin '),
     * attempt to authenticate using the provided password string instead of posting a public message.
     */
    if (trimmedMessage.startsWith(ADMIN_LOGIN_PREFIX)) {
      const password = trimmedMessage.slice(ADMIN_LOGIN_PREFIX.length).trim()
      if (password) {
        loginAdmin(password)
        return handleAdminCommand(mbToast.adminLogin, successSound)
      }
    }

    setIsPending(true)
    resetStatus()

    try {
      const result = await submitMessageBoardMessage(formData)

      if (!result.success) {
        showError(result.error, result.error === mbToast.rateLimit ? 300 : undefined)
        errorSound()
        toast.error(result.error)
      } else {
        formRef.current?.reset()
        startCountdown(300)
        toast.success(mbToast.success)
      }
    } catch {
      errorSound()
      toast.error(mbToast.connectionError)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-4">
      {/** Honeypot field that automated spam bots fill out and the server silently rejects. */}
      <input type="text" name="honey" className="hidden" tabIndex={-1} autoComplete="off" />

      <Input
        id="name"
        name="name"
        type="text"
        required
        placeholder={mbContent.namePlaceholder}
        disabled={isDisabled}
      />

      <TextArea
        id="message"
        name="message"
        required
        placeholder={mbContent.formPlaceholder}
        disabled={isDisabled}
        rows={3}
      />

      <div className="flex justify-end pt-1">
        <Button
          type="submit"
          isPending={isPending}
          isSuccess={success}
          countdown={countdown}
          loadingText={mbContent.buttonLoading}
          successText={mbContent.buttonSuccess}
          successIcon={Icons.chatCheck}
          defaultText={mbContent.buttonDefault}
          defaultIcon={Icons.chatUpload}
        />
      </div>
    </form>
  )
}
