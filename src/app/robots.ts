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

const AI_SEARCH_BOTS = ['OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'YouBot']

const SEARCH_ENGINE_BOTS = [
  'Googlebot',
  'Bingbot',
  'Slurp',
  'DuckDuckBot',
  'Baiduspider',
  'YandexBot',
]

const SOCIAL_CRAWLERS = [
  'facebookexternalhit',
  'Twitterbot',
  'LinkedInBot',
  'WhatsApp',
  'TelegramBot',
  'SlackBot',
  'DiscordBot',
]

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
