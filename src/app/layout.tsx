import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ViewsProvider } from "@/components/providers/views-context";
import { Toaster } from "@/components/ui/sonner";
import { BackToTop } from "@/components/common/back-to-top";
import { TooltipProvider } from "@/components/ui/tooltip";

import { fontSans, fontSerif, fontMono } from "@/lib/fonts";
import {
  getPersonSchema,
  getWebsiteSchema,
  getProfilePageSchema,
} from "@/lib/json-ld";
import {
  FULL_NAME,
  SITE_NAME,
  USERNAME,
  SITE_URL,
  ALL_KEYWORDS,
} from "@/constants/constants";
import { getOgImageUrl } from "@/lib/metadata";
import { homeSeoContent } from "@/data/content/seo-content";

import "./globals.css";

/**
 * Generates the SEO metadata for the application.
 * Uses global constants and localized content blocks to dynamically inject OpenGraph, Twitter Cards, and canonical URLs.
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: homeSeoContent.title,
    description: homeSeoContent.description,
    keywords: ALL_KEYWORDS,
    authors: [{ name: FULL_NAME }],
    creator: FULL_NAME,
    metadataBase: new URL(SITE_URL),
    manifest: "/manifest.json",
    icons: {
      apple: "/profpic.png",
    },
    alternates: {
      canonical: SITE_URL,
      types: {
        "application/rss+xml": `${SITE_URL}/feed.xml`,
      },
    },
    openGraph: {
      type: "website",
      locale: "en_US",
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
      card: "summary_large_image",
      creator: `@${USERNAME}`,
    },
  };
}

/**
 * JSON-LD structured data for rich search results.
 * Instantiates the Person, Website, and ProfilePage schemas based on schema.org standards.
 */
const jsonLd = [
  { "@context": "https://schema.org", ...getPersonSchema() },
  getWebsiteSchema(),
  getProfilePageSchema(),
];

/**
 * Main application layout that wraps all pages.
 * Wraps the DOM tree in global context providers (Tooltips, View tracking, Toasters).
 */
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} scroll-smooth`}
      data-scroll-behavior="smooth"
    >
      <head>
        <link rel="preload" href="/profpic.png" as="image" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-background font-sans text-foreground antialiased">
        <TooltipProvider delayDuration={0}>
          <ViewsProvider>
            <div className="mx-auto flex min-h-screen max-w-[800px] flex-col pb-20 pt-12 md:pb-12">
              <Navbar />
              <main className="flex-grow px-8 py-12">{children}</main>
              <Footer />
            </div>
          </ViewsProvider>
          <BackToTop />
          <Toaster position="bottom-center" />
          <div className="bottom-blur-fade" />
          <SpeedInsights />
          <Analytics />
        </TooltipProvider>
      </body>
    </html>
  );
}
