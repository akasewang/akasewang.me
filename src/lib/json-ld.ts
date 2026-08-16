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

/** The vocabulary every node here is written against, named once so no helper can misspell it */
const SCHEMA_CONTEXT = 'https://schema.org'

/**
 * The author, without a context of its own so it can sit inside the schemas below. A nested node
 * inherits the context of the one holding it, and getPersonSchema adds it for the standalone use.
 */
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

/**
 * Structured data for search engines, kept beside the metadata so the two cannot drift. Each helper
 * returns a plain object that a page embeds through serializeJsonLd.
 */

/** The author behind everything else here, embedded on its own in the root layout */
export function getPersonSchema() {
  return { '@context': SCHEMA_CONTEXT, ...PERSON_SCHEMA }
}

/** The site itself, including the search entry point that lets engines offer a sitelinks box */
export function getWebsiteSchema() {
  return {
    '@context': SCHEMA_CONTEXT,
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

/** One blog post, falling back to its generated OG image when the post names none */
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
    '@context': SCHEMA_CONTEXT,
    '@type': 'BlogPosting',
    headline: title,
    description: excerpt,
    datePublished: date,
    author: PERSON_SCHEMA,
    url: `${SITE_URL}/blogs/${slug}`,
    image: image ?? getOgImageUrl(title, 'Blog'),
  }
}

/** One project, as a CreativeWork rather than a posting, since a project is not dated news */
export function getProjectSchema({
  title,
  excerpt,
  date,
  slug,
  tech,
}: {
  title: string
  excerpt: string
  date?: string
  slug: string
  tech?: string[]
}) {
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'CreativeWork',
    name: title,
    headline: title,
    description: excerpt,
    /** Left out entirely when undated, rather than published as an empty value */
    ...(date && { datePublished: date }),
    author: PERSON_SCHEMA,
    creator: PERSON_SCHEMA,
    url: `${SITE_URL}/projects/${slug}`,
    image: getOgImageUrl(title, 'Project'),
    ...(tech && tech.length > 0 && { keywords: tech.join(', ') }),
  }
}

/** Marks the home page as the profile of the person above, which is what it actually is */
export function getProfilePageSchema() {
  return {
    '@context': SCHEMA_CONTEXT,
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

/** The trail a page sits on, numbered from one in the order it is given */
export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/**
 * Escapes the angle bracket, which is what stops a value ending the script tag it is embedded in.
 * Everything on the way to a page's JSON-LD has to go through here.
 */
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}
