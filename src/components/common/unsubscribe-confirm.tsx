'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { type UnsubscribeResult, unsubscribeAction } from '@/lib/actions/unsubscribe'
import type { UnsubscribePageContent } from '@/types/newsletter'

interface UnsubscribeConfirmProps {
  token: string
  content: UnsubscribePageContent
}

type View = 'confirm' | 'pending' | UnsubscribeResult
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
  const isError = view === 'error'
  return (
    <div className="space-y-6">
      <PageHeader
        title={isError ? content.errorTitle : content.confirmTitle}
        subtitle={isError ? content.errorDescription : content.confirmDescription}
      />
      <Button
        defaultText={content.confirmButton}
        defaultIcon={Icons.mail}
        loadingText={content.confirmPending}
        isPending={view === 'pending'}
        onClick={handleConfirm}
      />
    </div>
  )
}
