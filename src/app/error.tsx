'use client'

import { ErrorState } from '@/components/common/error-state'

/** Shown when a page throws, offering a way back rather than a blank screen */
export default function Error({ error }: { error: Error & { digest?: string } }) {
  return (
    <ErrorState
      error={error}
      title="something broke."
      subtitle="An unexpected error occurred while rendering this page."
    />
  )
}
