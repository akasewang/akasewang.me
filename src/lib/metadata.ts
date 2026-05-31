import { Metadata } from 'next'
import { SITE_URL, SITE_NAME, USERNAME, FULL_NAME } from '@/constants/constants'

interface MetadataProps {
  title: string
  description: string
  path: string
  image?: string
  imageAlt?: string
  type?: 'website' | 'article'
  publishedTime?: string
}

/**
 * Helper function to dynamically generate absolute Open Graph Image URLs.
 * Constructs query parameters for the `/api/og` route based on the provided title and type.
 *
 * @param title - The text to display on the generated image.
 * @param type - An optional category or type to display above the title.
 * @returns The fully qualified absolute URL to the generated OG image.
 */
export function getOgImageUrl(title?: string, type?: string): string {
  const params = new URLSearchParams()
  if (title) params.set('title', title)
  if (type) params.set('type', type)
  const queryString = params.toString()
  return `${SITE_URL}/api/og${queryString ? `?${queryString}` : ''}`
}

/**
 * Generates standardized Next.js Metadata objects (SEO tags, OpenGraph, Twitter Cards) for any page.
 * Ensures that canonical URLs, dynamic OG images, and basic SEO tags are consistently applied
 * Standardizes metadata across the entire application without duplicating boilerplate.
 *
 * @param props - An object containing page-specific SEO metadata like title, description, and path.
 * @returns A Next.js `Metadata` object ready to be exported from a page.
 */
export function constructMetadata({
  title,
  description,
  path,
  image = getOgImageUrl(),
  imageAlt,
  type = 'website',
  publishedTime,
}: MetadataProps): Metadata {
  const url = `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: imageAlt || title,
        },
      ],
      ...(publishedTime && {
        publishedTime,
        authors: [FULL_NAME],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: `@${USERNAME}`,
    },
  }
}
