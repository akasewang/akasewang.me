import type { ReactNode } from 'react'
import { serializeJsonLd } from '@/lib/json-ld'
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
}

/** The frame every inner page shares: its heading, its body and the note at the foot */
export function PageLayout({
  children,
  title,
  subtitle,
  footerText,
  backButtonHref,
  breadcrumb,
  className,
}: PageLayoutProps) {
  const breadcrumbJson = breadcrumb ? serializeJsonLd(breadcrumb) : null

  return (
    <main className={cn('space-y-8', className)}>
      {breadcrumbJson && <script type="application/ld+json">{breadcrumbJson}</script>}

      {(title || subtitle) && <PageHeader title={title || ''} subtitle={subtitle} />}

      {children}

      {footerText && <PageFooter text={footerText} backButtonHref={backButtonHref} />}
    </main>
  )
}
