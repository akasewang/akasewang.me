import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/constants/constants'

/** AI training and scraping bots blocked site wide. Answer engines go in AI_SEARCH_BOTS. */
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

/** AI answer engines allowed so the site can surface in ChatGPT, Perplexity and You.com. */
const AI_SEARCH_BOTS = ['OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'YouBot']

/** Traditional search engine crawlers explicitly allowed for SEO. */
const SEARCH_ENGINE_BOTS = [
  'Googlebot',
  'Bingbot',
  'Slurp',
  'DuckDuckBot',
  'Baiduspider',
  'YandexBot',
]

/** Social media crawlers allowed so shared links can render link previews. */
const SOCIAL_CRAWLERS = [
  'facebookexternalhit',
  'Twitterbot',
  'LinkedInBot',
  'WhatsApp',
  'TelegramBot',
  'SlackBot',
  'DiscordBot',
]

/**
 * Generates the site's `/robots.txt`.
 * Blocks AI training and scraping bots site wide, explicitly allows traditional search engines, AI
 * answer engines that cite sources and social preview crawlers, and keeps `/api` off limits for
 * everyone else. The sitemap URL and host derive from `SITE_URL` so they always match the canonical
 * domain.
 *
 * @returns A Next.js robots descriptor served at `/robots.txt`.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: BLOCKED_AI_BOTS, disallow: '/' },
      { userAgent: '*', allow: '/', disallow: '/api/', crawlDelay: 0 },
      { userAgent: SEARCH_ENGINE_BOTS, allow: '/' },
      { userAgent: AI_SEARCH_BOTS, allow: '/' },
      { userAgent: SOCIAL_CRAWLERS, allow: '/' },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: new URL(SITE_URL).host,
  }
}
