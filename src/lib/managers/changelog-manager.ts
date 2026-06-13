import { format, formatDistanceToNowStrict } from 'date-fns'
import { LONG_DATE_DISPLAY_FORMAT } from '@/constants/constants'
import { fetchGithub, GITHUB_REPO_URL } from '@/lib/github'
import type { ChangelogCommit, ChangelogDay } from '@/types/changelog'
import { formatTime } from '@/utils/utils'

/**
 * Changelog Manager
 * Fetches the site repository's commit history from the GitHub API and shapes it
 * into day grouped release notes for the `/changelog` timeline.
 */

const COMMITS_API_URL = `${GITHUB_REPO_URL}/commits`
const COMMITS_PER_PAGE = 100
/** Upper bound on fetched pages so the page stays fast as the repository grows. */
const MAX_PAGES = 3
/** Revalidation window in seconds, keeps GitHub API usage well under rate limits. */
const REVALIDATE_SECONDS = 3600

/** Shape of a single entry returned by the GitHub list commits endpoint. */
interface GithubCommitEntry {
  sha: string
  html_url: string
  commit: {
    message: string
    committer: { name: string; date: string } | null
    author: { name: string; date: string } | null
  }
  /** The GitHub account linked to the author's commit email, or null when unlinked. */
  author: { login: string; avatar_url: string; html_url: string } | null
}

/** Resolves a commit's timestamp into a single `Date`, parsed once and reused everywhere. */
function getCommitDate(entry: GithubCommitEntry): Date {
  const meta = entry.commit.committer ?? entry.commit.author
  return meta?.date ? new Date(meta.date) : new Date()
}

/** Maps a raw GitHub API entry into the UI ready {@link ChangelogCommit} shape. */
function toChangelogCommit(entry: GithubCommitEntry, date: Date): ChangelogCommit {
  const [subject, ...rest] = entry.commit.message.split('\n')
  const blocks: string[] = []
  let currentBlock: string[] = []

  for (let line of rest) {
    line = line.trim()

    if (!line) {
      if (currentBlock.length > 0) {
        blocks.push(currentBlock.join('\n'))
        currentBlock = []
      }
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      if (currentBlock.length > 0) {
        blocks.push(currentBlock.join('\n'))
      }
      currentBlock = [line]
    } else {
      currentBlock.push(line)
    }
  }

  if (currentBlock.length > 0) {
    blocks.push(currentBlock.join('\n'))
  }

  const body = blocks

  const account = entry.author
  /** Request a small avatar variant since the UI renders it at roughly 16px. */
  const authorAvatar = account
    ? `${account.avatar_url}${account.avatar_url.includes('?') ? '&' : '?'}s=48`
    : null

  return {
    sha: entry.sha,
    shortSha: entry.sha.slice(0, 7),
    subject,
    body,
    url: entry.html_url,
    authorName:
      account?.login ?? entry.commit.author?.name ?? entry.commit.committer?.name ?? 'unknown',
    authorAvatar,
    authorUrl: account?.html_url ?? null,
    date: date.toISOString(),
    time: formatTime(date),
    relativeTime: formatDistanceToNowStrict(date, { addSuffix: true }),
  }
}

/**
 * Fetches the repository commit history from GitHub, paginating up to {@link MAX_PAGES}.
 * Results are cached by the Next.js data cache and revalidated hourly. An optional
 * `GITHUB_TOKEN` env var raises the API rate limit but is not required.
 *
 * @returns The raw commit entries, newest first, or an empty array on API failure.
 */
async function fetchCommits(): Promise<GithubCommitEntry[]> {
  const entries: GithubCommitEntry[] = []

  for (let page = 1; page <= MAX_PAGES; page++) {
    try {
      const response = await fetchGithub(
        `${COMMITS_API_URL}?per_page=${COMMITS_PER_PAGE}&page=${page}`,
        { next: { revalidate: REVALIDATE_SECONDS } },
      )

      if (!response.ok) break

      const batch = (await response.json()) as GithubCommitEntry[]
      entries.push(...batch)

      /** A short page means the history is exhausted, stop paginating early. */
      if (batch.length < COMMITS_PER_PAGE) break
    } catch {
      /** Network failures degrade gracefully, the page renders whatever was fetched. */
      break
    }
  }

  return entries
}

/**
 * Returns the site's commit history grouped by calendar day, newest first,
 * mirroring how GitHub renders a repository's commit list.
 */
export async function getChangelog(): Promise<ChangelogDay[]> {
  const entries = await fetchCommits()
  const dayMap = new Map<string, ChangelogDay>()

  for (const entry of entries) {
    const date = getCommitDate(entry)
    const commit = toChangelogCommit(entry, date)
    const key = format(date, 'yyyy-MM-dd')

    const group = dayMap.get(key)
    if (group) {
      group.commits.push(commit)
    } else {
      dayMap.set(key, {
        date: key,
        label: format(date, LONG_DATE_DISPLAY_FORMAT),
        commits: [commit],
      })
    }
  }

  return [...dayMap.values()]
}
