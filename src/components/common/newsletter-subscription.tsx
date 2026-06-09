'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Icons } from '@/components/ui/icons'
import { newsletterContent } from '@/data/content/newsletter-content'
import { toastContent } from '@/data/content/toast-content'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import { useStatusTimer } from '@/hooks/use-status-timer'
import { subscribeAction } from '@/lib/actions/subscribe'
import { SectionTitle } from '../layout/section-title'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

/**
 * A form for subscribing to the newsletter, with a postsubmit cooldown (via `useStatusTimer`)
 * to prevent rapid resubmissions.
 *
 * @param hideHeader - If true, hides the title and description, rendering only the input and button.
 */
export function NewsletterSubscription({ hideHeader = false }: { hideHeader?: boolean }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const { success, countdown, startCountdown, showError, resetStatus } =
    useStatusTimer('newsletter-sub')
  const { error: errorSound } = useSoundEffects()

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    setLoading(true)
    resetStatus()

    try {
      const result = await subscribeAction(email.trim())

      if (!result.success) {
        throw new Error(result.error)
      }

      startCountdown(300)
      setEmail('')

      const successMessage = result.data.isNew
        ? toastContent.subscribe.successNew
        : toastContent.subscribe.successReturning

      toast.success(successMessage)
    } catch (err) {
      const message = err instanceof Error ? err.message : newsletterContent.errorFallback
      errorSound()
      toast.error(message)
      showError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="newsletter" className="space-y-4 animate-page-simple">
      {!hideHeader && (
        <>
          <SectionTitle>{newsletterContent.title}</SectionTitle>
          <p className="text-pretty text-sm font-normal leading-relaxed text-muted-foreground">
            {newsletterContent.descriptionPrefix}
            <span className="font-medium text-green-600">
              {newsletterContent.descriptionHighlight}
            </span>
            {newsletterContent.descriptionSuffix}
          </p>
        </>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading || countdown > 0}
          placeholder={newsletterContent.emailPlaceholder}
          className="sm:flex-1"
          required
        />
        <Button
          type="submit"
          isPending={loading}
          isSuccess={success}
          countdown={countdown}
          loadingText={newsletterContent.buttonLoading}
          successText={newsletterContent.buttonSuccess}
          successIcon={Icons.calendarCheck}
          defaultText={newsletterContent.buttonDefault}
          defaultIcon={Icons.bell}
          className="h-10 min-w-[140px]"
        />
      </form>
    </section>
  )
}
