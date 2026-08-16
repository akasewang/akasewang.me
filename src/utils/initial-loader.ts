import {
  REVEAL_COUNT_MS,
  REVEAL_COUNT_OUT_MS,
  REVEAL_DIGIT_STAGGER_MS,
  REVEAL_FADE_LEAD_MS,
  REVEAL_FADE_MS,
  REVEAL_FOCUS_MS,
  REVEAL_HOLD_MS,
  REVEAL_SETTLE_MS,
} from '@/constants/ui'

/** What the count runs to, and what decides how many digits have to leave in the stagger below */
export const INITIAL_LOADER_FINAL_COUNT = 100

/** Fast at first and slowing toward the end, which is how a real load tends to feel. */
const easeOutCubic = (progress: number) => 1 - (1 - progress) ** 3

/**
 * Resolves the displayed count from elapsed time rather than frame count, keeping the sequence the
 * same length on fast, slow and interrupted displays.
 */
export function getInitialLoaderCount(elapsedMs: number) {
  const progress = Math.max(0, Math.min(1, elapsedMs / REVEAL_COUNT_MS))
  return Math.floor(easeOutCubic(progress) * (INITIAL_LOADER_FINAL_COUNT - 1)) + 1
}

const finalDigitCount = String(INITIAL_LOADER_FINAL_COUNT).length
const countOutAt = REVEAL_COUNT_MS + REVEAL_HOLD_MS
const fadeAt = countOutAt + REVEAL_FADE_LEAD_MS
const lastDigitEndsAt =
  countOutAt + REVEAL_COUNT_OUT_MS + (finalDigitCount - 1) * REVEAL_DIGIT_STAGGER_MS
const focusEndsAt = fadeAt + REVEAL_FOCUS_MS
const veilEndsAt = fadeAt + REVEAL_FADE_MS

/**
 * Every absolute milestone in the opening sequence. Keeping the derived values together prevents
 * the scheduler, its animations and their regression tests from quietly using different math.
 */
export const INITIAL_LOADER_TIMELINE = Object.freeze({
  countEndsAt: REVEAL_COUNT_MS,
  countOutAt,
  fadeAt,
  lastDigitEndsAt,
  focusEndsAt,
  veilEndsAt,
  finishAt: Math.max(lastDigitEndsAt, focusEndsAt, veilEndsAt) + REVEAL_SETTLE_MS,
})
