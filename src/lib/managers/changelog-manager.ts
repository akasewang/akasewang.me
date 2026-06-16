import { format, formatDistanceToNowStrict } from 'date-fns'
import { LONG_DATE_DISPLAY_FORMAT } from '@/constants/constants'
import { fetchGithub, GITHUB_REPO_URL } from '@/lib/github'
import type { ChangelogCommit, ChangelogDay } from '@/types/changelog'
import { formatTime } from '@/utils/utils'

const COMMITS_API_URL = `${GITHUB_REPO_URL}/commits`
const COMMITS_PER_PAGE = 100

const MAX_PAGES = 3

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

function getCommitDate(entry: GithubCommitEntry): Date {
  const meta = entry.commit.committer ?? entry.commit.author
  return meta?.date ? new Date(meta.date) : new Date()
}

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
      if (blocks.length > 0 && blocks[blocks.length - 1] !== '') {
        blocks.push('')
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

  if (blocks.length > 0 && blocks[blocks.length - 1] === '') {
    blocks.pop()
  }

  const body = blocks

  const account = entry.author

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
