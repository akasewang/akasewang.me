export interface ChangelogCommit {
  sha: string
  shortSha: string
  subject: string
  body: string[]
  url: string
  authorName: string
  authorAvatar: string | null
  authorUrl: string | null
  date: string
  time: string
  relativeTime: string
}

export interface ChangelogDay {
  date: string
  label: string
  commits: ChangelogCommit[]
}
