import { NextResponse } from 'next/server'
import { fetchGithub, GITHUB_REPO_URL } from '@/lib/github'

/** Cache the route response and regenerate it hourly, matching the changelog cadence. */
export const revalidate = 3600

/**
 * Proxies the repository's GitHub star count through the server so the optional
 * `GITHUB_TOKEN` stays private while still raising the API rate limit. Browsers
 * hit this route instead of calling the GitHub API directly.
 *
 * @returns A JSON response shaped as `{ count: number }`, or a 502 on upstream failure.
 */
export async function GET() {
  try {
    const response = await fetchGithub(GITHUB_REPO_URL)

    if (!response.ok) {
      return NextResponse.json({ error: 'GitHub API error' }, { status: 502 })
    }

    const data = await response.json()
    const count = data.stargazers_count

    if (typeof count !== 'number') {
      return NextResponse.json({ error: 'Malformed GitHub response' }, { status: 502 })
    }

    return NextResponse.json({ count })
  } catch {
    return NextResponse.json({ error: 'GitHub API unreachable' }, { status: 502 })
  }
}
