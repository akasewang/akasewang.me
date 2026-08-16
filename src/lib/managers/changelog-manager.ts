import { format, formatDistanceToNowStrict } from 'date-fns'
import { LONG_DATE_DISPLAY_FORMAT } from '@/constants/constants'
import { fetchGithub, GITHUB_REPO_URL } from '@/lib/github'
import type { ChangelogCommit, ChangelogDay } from '@/types/changelog'
import { formatTime } from '@/utils/utils'

/**
 * Builds the changelog page from the repository's own commit history, so shipping is the only step
 * needed to publish one. Paging is capped and the result is cached, since this is a public API read
 * on a page that anyone can hit.
 */
const COMMITS_API_URL = `${GITHUB_REPO_URL}/commits`

/** 100 is the most GitHub will return at once, and three pages is as far back as the page goes */
const COMMITS_PER_PAGE = 100
const MAX_PAGES = 3

/** An hour, which is often enough for a changelog and rare enough to stay well inside the API quota */
const REVALIDATE_SECONDS = 3600

interface GithubCommitEntry {
  sha: string
  html_url: string
  commit: {
    message: string
    committer: { name: string; date: string } | null
    author: { name: string; date: string } | null
  }
  author: { login: string; avatar_url: string; html_url: string } | null
}

/** Committer date over author date, since a rebased commit keeps the original author date */
function getCommitDate(entry: GithubCommitEntry): Date {
  const meta = entry.commit.committer ?? entry.commit.author
  return meta?.date ? new Date(meta.date) : new Date()
}

/**
 * Splits a commit message into a subject and body blocks, keeping bullet lines as their own blocks
 * and blank lines as separators, so a conventional message renders as written.
 */
function toChangelogCommit(entry: GithubCommitEntry, date: Date): ChangelogCommit {
  const [subject, ...rest] = entry.commit.message.split('\n')
  const blocks: string[] = []
  let currentBlock: string[] = []

  for (let line of rest) {
    line = line.trim()

    /** A blank line closes the block it follows and leaves one gap behind, never two */
    if (!line) {
      if (currentBlock.length > 0) {
        blocks.push(currentBlock.join('\n'))
        currentBlock = []
      }
      if (blocks.length > 0 && blocks[blocks.length - 1] !== '') {
        blocks.push('')
      }
      /** A bullet starts a block of its own, whatever came before it */
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      if (currentBlock.length > 0) {
        blocks.push(currentBlock.join('\n'))
      }
      currentBlock = [line]
      /** Anything else is a continuation of the block being built */
    } else {
      currentBlock.push(line)
    }
  }

  if (currentBlock.length > 0) {
    blocks.push(currentBlock.join('\n'))
  }

  /** A message ending in blank lines would otherwise render as trailing space */
  if (blocks.length > 0 && blocks[blocks.length - 1] === '') {
    blocks.pop()
  }

  const body = blocks

  const account = entry.author

  /** Asks GitHub for a 48px avatar rather than shrinking the full size one in the browser */
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
 * Walks the commit pages up to the cap, stopping early on a short page. Any failure returns
 * whatever was already collected, so a rate limit shortens the changelog instead of emptying it.
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

      if (batch.length < COMMITS_PER_PAGE) break
    } catch {
      break
    }
  }

  return entries
}

/** Commits grouped by calendar day, which is how the timeline is laid out */
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
