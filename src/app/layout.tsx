import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata, Viewport } from 'next'
import { CommandMenu } from '@/components/command/command-menu'
import { BackToTop } from '@/components/common/back-to-top'
import { DotGridBackground } from '@/components/layout/dot-grid-background'
import { Footer } from '@/components/layout/footer'
import { InitialLoader } from '@/components/layout/initial-loader'
import { Navbar } from '@/components/layout/navbar'
import { PageTransition } from '@/components/layout/page-transition'
import { MotionProvider } from '@/components/providers/motion-provider'
import { TypingSounds } from '@/components/providers/typing-sounds'
import { ViewsProvider } from '@/components/providers/views-context'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ALL_KEYWORDS, FULL_NAME, SITE_NAME, SITE_URL, USERNAME } from '@/constants/constants'
import { homeSeoContent } from '@/data/content/seo-content'
import { getContentCommandGroups } from '@/lib/command-index'
import { fontMono, fontSans, fontSerif } from '@/lib/fonts'
import {
  getPersonSchema,
  getProfilePageSchema,
  getWebsiteSchema,
  serializeJsonLd,
} from '@/lib/json-ld'
import { getOgImageUrl } from '@/lib/metadata'

import './globals.css'

export const metadata: Metadata = {
  title: homeSeoContent.title,
  description: homeSeoContent.description,
  keywords: ALL_KEYWORDS,
  authors: [{ name: FULL_NAME }],
  creator: FULL_NAME,
  metadataBase: new URL(SITE_URL),
  manifest: '/manifest.json',
  icons: {
    apple: '/profpic.jpg',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
    types: {
      'application/rss+xml': `${SITE_URL}/feed.xml`,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: getOgImageUrl(homeSeoContent.ogTitle),
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: `@${USERNAME}`,
    creator: `@${USERNAME}`,
  },
}

/** Colours the browser chrome to match the page, which is dark on every theme */
export const viewport: Viewport = {
  themeColor: '#0a0a0a',
}

const jsonLd = [
  { '@context': 'https://schema.org', ...getPersonSchema() },
  getWebsiteSchema(),
  getProfilePageSchema(),
]

/**
 * The shell every page renders inside: the fonts, the providers, the navbar and footer, and the
 * transition that carries one page out as the next comes in.
 */
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const commandGroups = await getContentCommandGroups()

  return (
    <html
      lang="en"
      className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preload" href="/profpic.jpg" as="image" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
        />
      </head>
      <body className="font-sans text-foreground antialiased">
        <DotGridBackground />
        <MotionProvider>
          <InitialLoader />
          <TooltipProvider delayDuration={0}>
            <ViewsProvider>
              <div className="mx-auto flex min-h-screen max-w-[800px] flex-col pb-20 pt-12 md:pb-12">
                <Navbar />
                <main className="flex-grow px-8 py-12">
                  <PageTransition>{children}</PageTransition>
                </main>
                <Footer />
              </div>
            </ViewsProvider>
            <BackToTop />
            <TypingSounds />
            <CommandMenu contentGroups={commandGroups} />
            <Toaster position="top-right" />
            <div className="bottom-blur-fade" />
            <SpeedInsights />
            <Analytics />
          </TooltipProvider>
        </MotionProvider>
      </body>
    </html>
  )
}
