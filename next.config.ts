import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import type { NextConfig } from 'next'

const UI_SCALE_STYLESHEET = fileURLToPath(new URL('./src/app/globals.css', import.meta.url))

/**
 * The interface scale, lifted out of the stylesheet that owns it.
 *
 * A handful of sizes have to be serialized into markup rather than read from CSS, because a browser
 * can inspect them before the stylesheet exists and they cannot follow a custom property. Reading
 * the figure here and handing it to the bundle lets those follow `--ui-scale` anyway, leaving one
 * place to change it.
 *
 * Comments are dropped before the search so that a declaration is what gets found, not an example
 * written in prose above it. The build fails if the declaration is missing, duplicated or invalid:
 * silently falling back would leave the stylesheet and image hints using different scales.
 */
function readUiScale(): string {
  const css = readFileSync(UI_SCALE_STYLESHEET, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
  /** The closing semicolon is optional on a block's last declaration, so a brace ends it too */
  const declarations = [...css.matchAll(/--ui-scale:\s*([^;}]+)[;}]/g)]

  if (declarations.length !== 1) {
    throw new Error(
      `Expected exactly one numeric --ui-scale declaration in ${UI_SCALE_STYLESHEET}; found ${declarations.length}.`,
    )
  }

  const value = declarations[0][1].trim()
  const parsed = Number(value)

  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`--ui-scale in ${UI_SCALE_STYLESHEET} must be a positive finite number.`)
  }

  return value
}

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
  env: {
    NEXT_PUBLIC_UI_SCALE: readUiScale(),
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  /**
   * Routes that read the content directory at request time rather than at build. Tracing follows
   * imports, and these read a directory by path, so the files have to be named or the deployed
   * bundle goes without them and the read comes back empty.
   *
   * The post pages are here for the board under them: posting checks the board's key names a page
   * that exists, and that check runs in the server action, long after the page itself was built.
   */
  outputFileTracingIncludes: {
    '/feed.xml': ['./docs/blogs/**/*'],
    '/sitemap.xml': ['./docs/blogs/**/*', './docs/projects/**/*'],
    '/blogs/**': ['./docs/blogs/**/*', './docs/projects/**/*'],
    '/projects/**': ['./docs/blogs/**/*', './docs/projects/**/*'],
  },
  experimental: {
    serverActions: {
      allowedOrigins: [canonicalHost],
    },
  },
  images: {
    /**
     * Images are served as they sit rather than through the image route.
     *
     * That route is metered, and once its allowance is spent it answers every request with a 402
     * regardless of what is being asked for, which reaches the page as an image that failed to
     * load. Serving the files directly takes the whole site off that meter. The sources are
     * already WebP at the size they are shown, so there is little left for it to have done.
     */
    unoptimized: true,
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
