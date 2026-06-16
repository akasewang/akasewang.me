'use client'

import { useEffect } from 'react'
import { PageLayout } from '@/components/layout/page-layout'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <PageLayout
      title="something broke."
      subtitle="An unexpected error occurred. You can try again or head back home."
      footerText="Even the best UIs have bad days."
    >
      <div className="pt-4">
        <Button defaultText="try again" onClick={reset} />
      </div>
    </PageLayout>
  )
}
