import type { ReactNode } from 'react'
import { cn } from '@/utils/utils'
import { PageFooter } from './page-footer'
import { PageHeader } from './page-header'

type JsonLdValue = string | number | boolean | null | JsonLdValue[] | { [key: string]: JsonLdValue }

interface PageLayoutProps {
  children?: ReactNode
  title?: string
  subtitle?: string
  footerText?: string
  backButtonHref?: string
  breadcrumb?: JsonLdValue
  className?: string
  animate?: boolean
}

export function PageLayout({
  children,
  title,
  subtitle,
  footerText,
  backButtonHref,
  breadcrumb,
  className,
  animate = true,
}: PageLayoutProps) {
  const breadcrumbJson = breadcrumb ? JSON.stringify(breadcrumb).replace(/</g, '\\u003c') : null

  return (
    <main className={cn('space-y-8', animate && 'animate-page-simple', className)}>
      {breadcrumbJson && <script type="application/ld+json">{breadcrumbJson}</script>}

      {(title || subtitle) && <PageHeader title={title || ''} subtitle={subtitle} />}

      {children}

      {footerText && <PageFooter text={footerText} backButtonHref={backButtonHref} />}
    </main>
  )
}
