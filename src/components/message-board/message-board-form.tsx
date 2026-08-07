'use client'

import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { Input } from '@/components/ui/input'
import { TextArea } from '@/components/ui/text-area'
import { MESSAGE_BOARD_COOLDOWN_SECONDS } from '@/constants/rate-limits'
import { messageBoardContent as mbContent } from '@/data/content/message-board-content'
import { toastContent } from '@/data/content/toast-content'
import { useAdmin } from '@/hooks/use-admin'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import { useStatusTimer } from '@/hooks/use-status-timer'
import { requestAdminOtp } from '@/lib/actions/admin-otp-actions'
import { submitMessageBoardMessage } from '@/lib/actions/message-board-actions'
import { adminIntent } from '@/utils/admin-intent'

const mbToast = toastContent.messageBoard

/**
 * The box at the foot of the board, which doubles as the owner's way in.
 *
 * An ordinary message is posted, while an email address or a sign in code typed into the same box
 * starts or finishes the owner's sign in, which is why the two can never be read as one another.
 */
export function MessageBoardForm() {
  const [isPending, setIsPending] = useState(false)
  const { success, countdown, startCountdown, showError, resetStatus } =
    useStatusTimer('message-board')
  const { error: errorSound, success: successSound } = useSoundEffects()
  const { loginAdmin } = useAdmin()
  const formRef = useRef<HTMLFormElement>(null)
  const [nameDraft, setNameDraft] = useState('')
  const [messageDraft, setMessageDraft] = useState('')
  const [awaitingCode, setAwaitingCode] = useState(false)

  const fieldsDisabled = isPending || countdown > 0

  const resetForm = () => {
    formRef.current?.reset()
    setNameDraft('')
    setMessageDraft('')
    setAwaitingCode(false)
  }

  const { intent } = adminIntent(nameDraft, messageDraft, awaitingCode)
  const buttonDisabled = fieldsDisabled || intent === 'awaitCode'

  const buttonLabel = {
    post: mbContent.buttonDefault,
    sendCode: mbContent.buttonSendCode,
    awaitCode: mbContent.buttonEnterCode,
    signIn: mbContent.buttonSignIn,
  }[intent]

  const buttonIcon = {
    post: Icons.chatUpload,
    sendCode: Icons.mail,
    awaitCode: Icons.mail,
    signIn: Icons.checkCircle,
  }[intent]

  const handleAdminAction = (
    message: string,
    playSound: () => void,
    clear: 'form' | 'message' = 'form',
  ) => {
    if (clear === 'form') resetForm()
    else setMessageDraft('')
    playSound()
    toast.success(message)
  }

  async function action(formData: FormData) {
    const { intent: submitted, argument } = adminIntent(
      (formData.get('name') as string) || '',
      (formData.get('message') as string) || '',
      awaitingCode,
    )

    const failWith = (message: string) => {
      setMessageDraft('')
      errorSound()
      toast.error(message)
    }

    if (submitted === 'sendCode') {
      setIsPending(true)
      try {
        const requested = await requestAdminOtp(argument)
        if (!requested.success) return failWith(requested.error)

        setAwaitingCode(true)
        return handleAdminAction(toastContent.newsletter.otpSent, successSound, 'message')
      } finally {
        setIsPending(false)
      }
    }

    if (submitted === 'awaitCode') return

    if (submitted === 'signIn') {
      setIsPending(true)
      try {
        const result = await loginAdmin(argument)
        if (!result.success) return failWith(result.error)

        return handleAdminAction(mbToast.adminLogin, successSound)
      } finally {
        setIsPending(false)
      }
    }

    setIsPending(true)
    resetStatus()

    try {
      const result = await submitMessageBoardMessage(formData)

      if (!result.success) {
        showError(result.error, result.retryAfterSeconds)
        errorSound()
        toast.error(result.error)
      } else {
        resetForm()
        startCountdown(MESSAGE_BOARD_COOLDOWN_SECONDS)
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
      <input
        type="text"
        name="honey"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-label="Leave this field empty"
      />

      <Input
        id="name"
        name="name"
        type="text"
        required
        value={nameDraft}
        onChange={(e) => setNameDraft(e.target.value)}
        placeholder={mbContent.namePlaceholder}
        aria-label={mbContent.namePlaceholder}
        disabled={fieldsDisabled}
      />

      <TextArea
        id="message"
        name="message"
        required={intent === 'post'}
        value={messageDraft}
        onChange={(e) => setMessageDraft(e.target.value)}
        placeholder={mbContent.formPlaceholder}
        aria-label={mbContent.formPlaceholder}
        disabled={fieldsDisabled}
        rows={3}
      />

      <div className="flex justify-end pt-1">
        <Button
          type="submit"
          disabled={buttonDisabled}
          isPending={isPending}
          isSuccess={success}
          countdown={countdown}
          loadingText={mbContent.buttonLoading}
          successText={mbContent.buttonSuccess}
          successIcon={Icons.check}
          defaultText={buttonLabel}
          defaultIcon={buttonIcon}
        />
      </div>
    </form>
  )
}
