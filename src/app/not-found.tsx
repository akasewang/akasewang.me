import type { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { FULL_NAME } from '@/constants/constants'

export const metadata: Metadata = {
  title: `Page not found | ${FULL_NAME}`,
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <PageLayout
      title="page not found."
      subtitle="The page you are looking for does not exist or has been moved."
      footerText="You're lost, but at least the UI looks good, right?"
      animate={true}
    />
  )
}
