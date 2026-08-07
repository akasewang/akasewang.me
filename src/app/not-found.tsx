import type { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { FULL_NAME } from '@/constants/constants'

export const metadata: Metadata = {
  title: `Page not found | ${FULL_NAME}`,
  robots: { index: false, follow: false },
}

/** Shown for a URL that matches nothing */
export default function NotFound() {
  return (
    <PageLayout
      title="page not found."
      subtitle="The page you are looking for does not exist or has been moved."
    />
  )
}
