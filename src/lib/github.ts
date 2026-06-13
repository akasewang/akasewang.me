import { SITE, USERNAME } from '@/constants/constants'

/** Base GitHub REST API URL for the site repository, shared by every repo read. */
export const GITHUB_REPO_URL = `https://api.github.com/repos/${USERNAME}/${SITE}`

/** Base headers for every GitHub API request. */
const BASE_HEADERS = { Accept: 'application/vnd.github+json' }

/**
 * Server side fetch wrapper for the GitHub API. Attaches the optional `GITHUB_TOKEN`
 * env var to raise the rate limit, and on a 401 (expired or revoked token) or 403
 * (token missing a permission) retries the same request anonymously since the site
 * only reads public data that succeeds without credentials. Never call this from
 * client code, the token must stay on the server.
 *
 * @param url - The fully qualified GitHub API URL to fetch.
 * @param init - Optional fetch options (e.g. Next.js revalidation), headers are managed here.
 * @returns The GitHub API response, authenticated when possible.
 */
export async function fetchGithub(url: string, init?: RequestInit): Promise<Response> {
  const token = process.env.GITHUB_TOKEN

  const response = await fetch(url, {
    ...init,
    headers: {
      ...BASE_HEADERS,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  })

  if ((response.status === 401 || response.status === 403) && token) {
    return fetch(url, { ...init, headers: BASE_HEADERS })
  }

  return response
}
