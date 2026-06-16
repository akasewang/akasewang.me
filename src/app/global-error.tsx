'use client'

import { useEffect } from 'react'
import { DotGridBackground } from '@/components/layout/dot-grid-background'
import { PageLayout } from '@/components/layout/page-layout'
import { Button } from '@/components/ui/button'
import { fontMono, fontSans, fontSerif } from '@/lib/fonts'

import './globals.css'

export default function GlobalError({
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
    <html
      lang="en"
      className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} scroll-smooth`}
    >
      <body className="font-sans text-foreground antialiased bg-background">
        <DotGridBackground />
        <div className="mx-auto flex min-h-screen max-w-[800px] flex-col pb-20 pt-12 md:pb-12">
          <div className="flex-grow px-8 py-12 flex flex-col justify-center">
            <PageLayout
              title="critical error."
              subtitle="A critical error occurred at the application root. Please try again."
              footerText="Even the best UIs have bad days."
            >
              <div className="pt-4">
                <Button defaultText="try again" onClick={reset} />
              </div>
            </PageLayout>
          </div>
        </div>
      </body>
    </html>
  )
}
