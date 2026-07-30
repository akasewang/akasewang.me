'use client'

import { ErrorState } from '@/components/common/error-state'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <ErrorState
      error={error}
      reset={reset}
      title="something broke."
      subtitle="An unexpected error occurred. You can try again or head back home."
    />
  )
}
