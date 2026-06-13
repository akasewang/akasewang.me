/** A single commit entry surfaced on the changelog timeline. */
export interface ChangelogCommit {
  /** Full commit SHA, used as a stable React key. */
  sha: string
  /** Abbreviated seven character SHA shown in the UI. */
  shortSha: string
  /** First line of the commit message. */
  subject: string
  /** Remaining commit message lines, trimmed with blanks removed. */
  body: string[]
  /** Absolute GitHub URL to the commit. */
  url: string
  /** Display name for the author: the GitHub username when linked, else the git author name. */
  authorName: string
  /** GitHub avatar URL for the author, or null when the commit is not linked to an account. */
  authorAvatar: string | null
  /** GitHub profile URL for the author, or null when unlinked. */
  authorUrl: string | null
  /** ISO 8601 commit timestamp. */
  date: string
  /** Lowercase 12 hour commit time (e.g. "5:04 pm"). */
  time: string
  /** Human readable relative time (e.g. "2 hours ago") computed at fetch time. */
  relativeTime: string
}

/** A group of commits that landed on the same calendar day, GitHub history style. */
export interface ChangelogDay {
  /** Day key in `yyyy-MM-dd` format, used as a stable React key. */
  date: string
  /** Display label for the day heading (e.g. "13 June 2026"). */
  label: string
  /** Commits pushed on this day, newest first. */
  commits: ChangelogCommit[]
}
