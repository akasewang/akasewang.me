/** Standardized return types for all Next.js server actions. */
export type ActionResult<T = void> =
  /** Success variant carrying the action's data and an optional status message. */
  | { success: true; data: T; message?: string }
  /** Failure variant carrying a human readable error string. */
  | { success: false; error: string }
