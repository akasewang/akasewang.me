/** Standardized return types for all Next.js server actions. */
export type ActionResult<T = void> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string }
