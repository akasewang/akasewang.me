import {
  CORE_TECHS,
  FULL_NAME,
  ROLES,
  SECONDARY_TECHS,
  SITE_DESCRIPTION,
  SITE_URL,
} from '@/constants/constants'
import { activeSocials } from '@/data/static/social'
import { getOgImageUrl } from '@/lib/metadata'

const PERSON_SCHEMA = {
  '@type': 'Person',
  name: FULL_NAME,
  url: SITE_URL,
  jobTitle: ROLES[0],
  description: SITE_DESCRIPTION,
  image: `${SITE_URL}/profpic.jpg`,
  knowsAbout: [...CORE_TECHS, ...SECONDARY_TECHS],
  sameAs: activeSocials.map((social) => social.href),
}

export function getPersonSchema() {
  return PERSON_SCHEMA
}

export function getWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: FULL_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    author: PERSON_SCHEMA,
    about: PERSON_SCHEMA,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/blogs?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function getBlogPostingSchema({
  title,
  excerpt,
  date,
  slug,
  image,
}: {
  title: string
  excerpt: string
  date: string
  slug: string
  image?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: excerpt,
    datePublished: date,
    author: PERSON_SCHEMA,
    url: `${SITE_URL}/blogs/${slug}`,
    image: image ?? getOgImageUrl(title, 'Blog'),
  }
}

export function getProjectSchema({
  title,
  excerpt,
  date,
  slug,
  tech,
}: {
  title: string
  excerpt: string
  date: string
  slug: string
  tech?: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: title,
    headline: title,
    description: excerpt,
    datePublished: date,
    author: PERSON_SCHEMA,
    creator: PERSON_SCHEMA,
    url: `${SITE_URL}/projects/${slug}`,
    image: getOgImageUrl(title, 'Project'),
    ...(tech && tech.length > 0 && { keywords: tech.join(', ') }),
  }
}

export function getProfilePageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: PERSON_SCHEMA,
    dateCreated: '2024-01-01',
    dateModified: new Date().toISOString().split('T')[0],
    name: `${FULL_NAME} - ${ROLES[0]}`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: SITE_URL,
        },
      ],
    },
  }
}

export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}
