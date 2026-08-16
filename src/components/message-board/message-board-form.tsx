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

interface MessageBoardFormProps {
  /** Which board the message is filed against, left out for the site-wide one */
  boardSlug?: string
  /**
   * Whether the box also serves as the owner's way in. Only the board's own page offers it: the
   * session it creates is a cookie that every other board already reads, so putting the sign in
   * under each post would be a second door into the same room.
   */
  allowAdminSignIn?: boolean
  onPosted?: () => void
}

/**
 * The box at the foot of a board, which on the board's own page doubles as the owner's way in.
 *
 * An ordinary message is posted, while an email address or a sign in code typed into the same box
 * starts or finishes the owner's sign in, which is why the two can never be read as one another.
 */
export function MessageBoardForm({
  boardSlug,
  allowAdminSignIn = true,
  onPosted,
}: MessageBoardFormProps) {
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

  /**
   * What the box is currently for, read from what has been typed into it. The button then says so,
   * which is the only signal that the form has quietly become a sign in. Where the sign in is not
   * offered the box is only ever a message box, whatever happens to be typed into it.
   */
  const readIntent = (name: string, message: string) =>
    allowAdminSignIn
      ? adminIntent(name, message, awaitingCode)
      : { intent: 'post' as const, argument: '' }

  const { intent } = readIntent(nameDraft, messageDraft)
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
    /** Read again from what was actually submitted, rather than trusting the drafts above */
    const { intent: submitted, argument } = readIntent(
      (formData.get('name') as string) || '',
      (formData.get('message') as string) || '',
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

    /** The code has been sent but not typed yet, so there is nothing to do with this submit */
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

    /** Everything above was the owner signing in. What is left is an ordinary message */
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
        onPosted?.()
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
      {/** Which board this belongs to. The server checks it names a real page before filing it */}
      {boardSlug && <input type="hidden" name="slug" value={boardSlug} />}

      {/** The honeypot. Hidden and out of the tab order, so only something automated fills it */}
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
        autoComplete="name"
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
        autoComplete="off"
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
