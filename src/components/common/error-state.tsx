'use client'

import { useEffect } from 'react'
import { PageLayout } from '@/components/layout/page-layout'
import { Button } from '@/components/ui/button'

interface ErrorStateProps {
  error: Error & { digest?: string }
  reset: () => void
  title: string
  subtitle: string
}

export function ErrorState({ error, reset, title, subtitle }: ErrorStateProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <PageLayout title={title} subtitle={subtitle} footerText="Even the best UIs have bad days.">
      <div className="pt-4">
        <Button defaultText="try again" onClick={reset} />
      </div>
    </PageLayout>
  )
}
