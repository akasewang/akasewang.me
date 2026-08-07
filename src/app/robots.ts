import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/constants/constants'

const BLOCKED_AI_BOTS = [
  'GPTBot',
  'CCBot',
  'anthropic-ai',
  'Claude-Web',
  'ClaudeBot',
  'Google-Extended',
  'Meta-ExternalAgent',
  'Meta-ExternalFetcher',
  'Applebot-Extended',
  'Amazonbot',
  'Bytespider',
  'Diffbot',
  'Cohere-ai',
  'Omgilibot',
  'Omgili',
  'FacebookBot',
]

/**
 * What crawlers may read. Search engines are welcome everywhere except the owner's own pages,
 * while the AI crawlers listed above are turned away from the site entirely.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: BLOCKED_AI_BOTS, disallow: '/' },
      {
        userAgent: '*',
        allow: ['/', '/api/og'],
        disallow: '/api/',
        crawlDelay: 0,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: new URL(SITE_URL).host,
  }
}
