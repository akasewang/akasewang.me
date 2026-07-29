import type { NextConfig } from 'next'

const canonicalHost = 'www.akasewang.me'
const canonicalOrigin = `https://${canonicalHost}`
const devAllowedOrigin = process.env.NEXT_DEV_ALLOWED_ORIGIN

const redirectHosts = [
  'akasewang.me',
  'akasewang.com',
  'www.akasewang.com',
  'akashdewangan.com',
  'www.akashdewangan.com',
]

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
]

const nextConfig: NextConfig = {
  ...(devAllowedOrigin && { allowedDevOrigins: [devAllowedOrigin] }),
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  outputFileTracingIncludes: {
    '/feed.xml': ['./docs/blogs/**/*'],
    '/sitemap.xml': ['./docs/blogs/**/*', './docs/projects/**/*'],
  },
  experimental: {
    serverActions: {
      allowedOrigins: [canonicalHost],
    },
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
  async redirects() {
    return redirectHosts.map((host) => ({
      source: '/:path*',
      has: [{ type: 'host' as const, value: host }],
      destination: `${canonicalOrigin}/:path*`,
      permanent: true,
    }))
  },
}

export default nextConfig
