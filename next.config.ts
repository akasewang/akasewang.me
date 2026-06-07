import type { NextConfig } from 'next'
import withMDX from '@next/mdx'

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
  experimental: {
    /**
     * The site is served live on several domains (canonical: akasewang.me). Listing every
     * host here lets Server Actions (newsletter, message board) pass their CSRF/origin check
     * regardless of which domain the form was submitted from.
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
