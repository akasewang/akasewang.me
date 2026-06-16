import type { Metadata } from 'next'
import { FULL_NAME, SITE_NAME, SITE_URL, USERNAME } from '@/constants/constants'

interface MetadataProps {
  title: string
  description: string
  path: string
  image?: string
  imageAlt?: string
  type?: 'website' | 'article'
  publishedTime?: string
}

export function getOgImageUrl(title?: string, type?: string): string {
  const params = new URLSearchParams()
  if (title) params.set('title', title)
  if (type) params.set('type', type)
  const queryString = params.toString()
  return `${SITE_URL}/api/og${queryString ? `?${queryString}` : ''}`
}

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
      locale: 'en_US',
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
      images: [
        {
          url: image,
          alt: imageAlt || title,
        },
      ],
      site: `@${USERNAME}`,
      creator: `@${USERNAME}`,
    },
  }
}
