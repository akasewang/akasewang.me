import withMDX from '@next/mdx'
import type { NextConfig } from 'next'

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

const nextConfig: NextConfig = withMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})({
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  outputFileTracingIncludes: {
    '/feed.xml': ['./docs/blogs/**/*'],
    '/sitemap.xml': ['./docs/blogs/**/*', './docs/projects/**/*'],
  },
  experimental: {
    /**
     * Allowed Server Action origins for the site's alternate domains. Next lists this under
     * experiments because the config key still lives under `experimental`, not because this
     * allowlist is unsafe.
     */
    serverActions: {
      allowedOrigins: [
        'akasewang.me',
        'www.akasewang.me',
        'akasewang.com',
        'www.akasewang.com',
        'akashdewangan.com',
        'www.akashdewangan.com',
      ],
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
})

export default nextConfig
