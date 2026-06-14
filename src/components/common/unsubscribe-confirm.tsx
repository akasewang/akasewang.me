'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { unsubscribeAction, type UnsubscribeResult } from '@/lib/actions/unsubscribe'
import type { UnsubscribePageContent } from '@/types/newsletter'

/** Props for {@link UnsubscribeConfirm}. */
interface UnsubscribeConfirmProps {
  /** The per subscriber token read from the unsubscribe link. */
  token: string
  /** Copy for every state of the unsubscribe flow. */
  content: UnsubscribePageContent
}

type View = 'confirm' | 'pending' | UnsubscribeResult

/**
 * Confirmation prompt for the unsubscribe page. The subscriber is deactivated only on click, never on
 * page load, so email scanners and prefetchers that open the link cannot unsubscribe anyone.
 */
export function UnsubscribeConfirm({ token, content }: UnsubscribeConfirmProps) {
  const [view, setView] = useState<View>('confirm')

  async function handleConfirm() {
    setView('pending')
    setView(await unsubscribeAction(token))
  }

  if (view === 'success') {
    return <PageHeader title={content.successTitle} subtitle={content.successDescription} />
  }
  if (view === 'invalid') {
    return <PageHeader title={content.invalidTitle} subtitle={content.invalidDescription} />
  }

  /** Confirm, pending and error all keep the action button so a transient failure stays retryable. */
  const isError = view === 'error'

  return (
    <div className="flex flex-col items-center gap-6">
      <PageHeader
        title={isError ? content.errorTitle : content.confirmTitle}
        subtitle={isError ? content.errorDescription : content.confirmDescription}
      />
      <Button
        defaultText={content.confirmButton}
        defaultIcon={Icons.mail}
        loadingText={content.confirmPending}
        isPending={view === 'pending'}
        showArrow={false}
        onClick={handleConfirm}
      />
    </div>
  )
}
