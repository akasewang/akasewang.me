import { SITE, USERNAME } from '@/constants/constants'

export const GITHUB_REPO_URL = `https://api.github.com/repos/${USERNAME}/${SITE}`

/** Sent on every call. The token is added when present, which raises the rate limit */
const BASE_HEADERS = { Accept: 'application/vnd.github+json' }

/**
 * Calls the GitHub API with the token when there is one. An expired or revoked token is retried
 * unauthenticated rather than surfaced, since these reads are all public and a lower rate limit is
 * better than a broken badge.
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
