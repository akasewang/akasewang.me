/**
 * One commit as the changelog page shows it, already formatted for display: the subject split from
 * the rest of the message, and the timestamp kept in all three forms the page reads it in.
 */
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

/** A day's commits gathered under one heading, which is how the timeline is grouped */
export interface ChangelogDay {
  date: string
  label: string
  commits: ChangelogCommit[]
}
