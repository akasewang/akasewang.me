/**
 * What every server action returns. A union, so reading the data means having checked success
 * first. retryAfterSeconds is set only where a rate limit refused it.
 */
export type ActionResult<T = void> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string; retryAfterSeconds?: number }
