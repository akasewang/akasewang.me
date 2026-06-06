import { NextResponse } from 'next/server'
import { getRegistryComponents } from '@/registry/registry-sync'
import { getComponentSource } from '@/lib/get-component'
import { incrementInstallAction } from '@/lib/actions/views'

/**
 * Shadcn UI Registry API Route.
 * This route is pinged by the shadcn CLI (`npx shadcn add <slug>`) to fetch component code.
 * It dynamically resolves the CLI schema from MDX frontmatter and reads the raw component
 * source from the local file system, applying path transformations so registry internal
 * imports map correctly for the end user.
 *
 * Includes an integrated telemetry tracker that filters by User-Agent to prevent bot inflation.
 * Utilizes an ephemeral in memory cache to deduplicate CI/CD burst installs by IP.
 *
 * @param request - The incoming HTTP request.
 * @param params - The dynamic route parameters containing the component slug.
 * @returns A JSON response conforming to the shadcn registry schema.
 */
export const dynamic = 'force-dynamic'

/** In memory cache to deduplicate CI/CD burst installs by IP */
const installRateLimitMap = new Map<string, number>()
/** 1 minute window for rate limiting */
const RATE_LIMIT_WINDOW_MS = 60000

/** Map for resolving internal registry paths to standard user paths */
const PATH_REPLACEMENTS: Record<string, string> = {
  '@/registry/hooks/': '@/hooks/',
  '@/registry/components/': '@/components/ui/',
  '@/registry/lib/': '@/lib/',
  '@/registry/utils/': '@/utils/',
}

/** Compile the regex once during module initialization, not on every request */
const REPLACEMENT_REGEX = new RegExp(Object.keys(PATH_REPLACEMENTS).join('|'), 'g')

/**
 * Handles GET requests for component files.
 * @param request - The incoming HTTP request.
 * @param params - The dynamic route parameters containing the component slug.
 * @returns A JSON response conforming to the shadcn registry schema.
 */
export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const cleanSlug = slug.endsWith('.json') ? slug.slice(0, -5) : slug

    const components = await getRegistryComponents()
    const componentData = components.find((c) => c.slug === cleanSlug)

    if (!componentData) {
      return new NextResponse('Not Found', { status: 404 })
    }

    const files = componentData.files.map((file) => ({
      path: file.path.slice(file.path.lastIndexOf('/') + 1),
      /** Perform a single pass regex replacement instead of multiple string traversals */
      content: getComponentSource(file.path).replace(
        REPLACEMENT_REGEX,
        (match) => PATH_REPLACEMENTS[match],
      ),
      type: file.type,
      target: file.target ?? '',
    }))

    const userAgent = request.headers.get('user-agent') ?? ''
    const isBrowserOrBot = /Mozilla|AppleWebKit|Chrome|Safari|bot|spider|crawl/i.test(userAgent)

    /** Only run telemetry logic if requested by the CLI (not browsers or search bots) */
    if (!isBrowserOrBot) {
      const forwardedFor = request.headers.get('x-forwarded-for')
      const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown'
      const cacheKey = `${ip}-${cleanSlug}`
      const now = Date.now()
      const lastSeen = installRateLimitMap.get(cacheKey)

      /** Throttle CI/CD burst installs */
      if (!lastSeen || now - lastSeen > RATE_LIMIT_WINDOW_MS) {
        installRateLimitMap.set(cacheKey, now)
        /** Fire and forget: do not await this, so the user's download isn't blocked by database latency */
        incrementInstallAction(cleanSlug).catch(console.error)
      }

      /** Deterministic garbage collection to prevent memory leaks in the Node container */
      if (installRateLimitMap.size > 1000) {
        const cutoff = now - RATE_LIMIT_WINDOW_MS
        for (const [key, timestamp] of installRateLimitMap.entries()) {
          if (timestamp < cutoff) installRateLimitMap.delete(key)
        }
        /** Absolute fallback if the map is being actively spammed */
        if (installRateLimitMap.size > 1000) installRateLimitMap.clear()
      }
    }

    /** Return the response immediately without waiting for telemetry to resolve */
    return NextResponse.json({
      $schema: 'https://ui.shadcn.com/schema/registry-item.json',
      name: componentData.slug,
      type: componentData.type,
      dependencies: componentData.dependencies ?? [],
      devDependencies: componentData.devDependencies ?? [],
      registryDependencies: componentData.registryDependencies ?? [],
      cssVars: componentData.cssVars,
      tailwind: componentData.tailwind,
      files,
    })
  } catch (error) {
    console.error(error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
