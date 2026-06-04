import { ReactNode } from 'react'
import { PageHeader } from './page-header'
import { PageFooter } from './page-footer'
import { cn } from '@/utils/utils'

/** Props for {@link PageLayout}. */
interface PageLayoutProps {
  children?: ReactNode
  title?: string
  subtitle?: string
  footerText?: string
  backButtonHref?: string
  breadcrumb?: any
  className?: string
  animate?: boolean
}

/** Shared layout shell used by dynamic top-level routes (Blogs, Projects, Registry). */
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
  return (
    <main className={cn('space-y-8', animate && 'animate-page-simple', className)}>
      {/*
       * Automatically inject Breadcrumb JSON-LD schema into the document head
       * for rich SEO results in search engines.
       */}
      {breadcrumb && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
        />
      )}

      {(title || subtitle) && <PageHeader title={title || ''} subtitle={subtitle} />}

      {children}

      {footerText && <PageFooter text={footerText} backButtonHref={backButtonHref} />}
    </main>
  )
}
