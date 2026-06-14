'use client'

import { useEffect } from 'react'
import { PageLayout } from '@/components/layout/page-layout'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'

/**
 * Route error boundary. Catches unexpected render or data errors in the page subtree and offers a
 * retry, keeping the branded shell instead of falling back to the default Next.js error screen.
 */
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
      className="flex min-h-[70vh] flex-col items-center justify-center text-center"
    >
      <Button
        defaultText="try again"
        defaultIcon={Icons.arrowForward}
        showArrow={false}
        onClick={reset}
      />
    </PageLayout>
  )
}
