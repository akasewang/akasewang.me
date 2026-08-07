'use client'

import type React from 'react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ADMIN_CODE_LENGTH,
  ADMIN_CODE_SHAPE,
  ADMIN_CODE_STRIP,
  EMAIL_SHAPE,
} from '@/constants/constants'
import { adminNewsletterContent } from '@/data/content/admin-content'
import { toastContent } from '@/data/content/toast-content'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import { useStatusTimer } from '@/hooks/use-status-timer'
import { requestAdminOtp } from '@/lib/actions/admin-otp-actions'
import { signInAdmin } from '@/lib/actions/admin-session-actions'
import { broadcastNewsletter } from '@/lib/actions/newsletter-actions'
import type { BlogPost } from '@/types/blog'

/** The owner's composer for a newsletter issue, with a preview and a test send */
export function AdminNewsletterForm({ blogs }: { blogs: BlogPost[] }) {
  const [adminEmail, setAdminEmail] = useState('')
  const [adminSecret, setAdminSecret] = useState('')
  const [selectedBlogSlug, setSelectedBlogSlug] = useState(blogs[0]?.slug || '')
  const [loading, setLoading] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const blogOptions = useMemo(
    () => blogs.map(({ title, slug }) => ({ label: title, value: slug })),
    [blogs],
  )
  const { success, countdown, startCountdown, resetStatus } = useStatusTimer('admin-newsletter')
  const { error: errorSound } = useSoundEffects()

  const isReadyToSend = ADMIN_CODE_SHAPE.test(adminSecret.trim())
  const hasValidAdminEmail = EMAIL_SHAPE.test(adminEmail.trim())

  const isDisabled = loading || countdown > 0

  const requestButtonText = !hasValidAdminEmail
    ? adminNewsletterContent.enterEmailDefault
    : codeSent
      ? adminNewsletterContent.enterCodeDefault
      : adminNewsletterContent.sendCodeDefault

  async function requestCode() {
    if (!hasValidAdminEmail) {
      errorSound()
      toast.error(
        adminEmail.trim()
          ? toastContent.subscribe.invalidEmail
          : toastContent.newsletter.otpEmailRequired,
      )
      return
    }

    setLoading(true)
    setCodeSent(false)

    try {
      const response = await requestAdminOtp(adminEmail.trim())

      if (!response.success) {
        errorSound()
        toast.error(response.error)
      } else {
        setCodeSent(true)
        toast.success(toastContent.newsletter.otpSent)
      }
    } catch {
      errorSound()
      toast.error(toastContent.newsletter.unexpectedError)
    } finally {
      setLoading(false)
    }
  }

  async function broadcast() {
    setLoading(true)
    resetStatus()

    try {
      const signIn = await signInAdmin(adminSecret.trim())
      if (!signIn.success) {
        errorSound()
        toast.error(signIn.error)
        return
      }

      const response = await broadcastNewsletter(selectedBlogSlug)

      if (!response.success) {
        errorSound()
        toast.error(response.error)
      } else {
        toast.success(toastContent.newsletter.broadcastSuccess(response.data.count))
        setAdminSecret('')
        setCodeSent(false)
        startCountdown(3)
      }
    } catch {
      errorSound()
      toast.error(toastContent.newsletter.unexpectedError)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    await (isReadyToSend ? broadcast() : requestCode())
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="space-y-3">
        <Select
          items={blogOptions}
          value={selectedBlogSlug}
          onValueChange={setSelectedBlogSlug}
          disabled={isDisabled}
        >
          <SelectTrigger>
            <SelectValue placeholder={adminNewsletterContent.blogSelectPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            {blogOptions.map(({ label, value }) => (
              <SelectItem key={value} value={value}>
                <span className="text-balance">{label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="email"
          autoComplete="email"
          value={adminEmail}
          onChange={(e) => {
            setAdminEmail(e.target.value)
            setCodeSent(false)
          }}
          placeholder={adminNewsletterContent.adminEmailPlaceholder}
          disabled={isDisabled}
        />

        <Input
          type="text"
          autoComplete="one-time-code"
          spellCheck={false}
          autoCapitalize="off"
          maxLength={ADMIN_CODE_LENGTH}
          value={adminSecret}
          onChange={(e) => setAdminSecret(e.target.value.replace(ADMIN_CODE_STRIP, ''))}
          placeholder={adminNewsletterContent.adminCodePlaceholder}
          disabled={isDisabled}
        />
      </div>

      <div className="flex justify-end">
        {isReadyToSend ? (
          <Button
            type="submit"
            disabled={isDisabled}
            isPending={loading}
            isSuccess={success}
            countdown={countdown}
            loadingText={adminNewsletterContent.buttonLoading}
            successText={adminNewsletterContent.buttonSuccess}
            successIcon={Icons.mailCheck}
            defaultText={adminNewsletterContent.buttonDefault}
            defaultIcon={Icons.broadcast}
          />
        ) : (
          <Button
            type="submit"
            disabled={isDisabled || !hasValidAdminEmail || codeSent}
            isPending={loading}
            loadingText={adminNewsletterContent.sendCodeLoading}
            defaultText={requestButtonText}
            defaultIcon={Icons.mail}
          />
        )}
      </div>
    </form>
  )
}
