import type { Transition, Variants } from 'framer-motion'

/**
 * Standardized framer-motion configs for consistent interactions across the app.
 * Each is exported individually so components share the same feel.
 */

/** Snappy spring for quick, responsive UI feedback (taps, toggles, small moves). */
export const SPRING_TRANSITION: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
}

/** Softer, lower stiffness spring for fluid gliding motion (e.g. the hover highlight). */
export const SMOOTH_SPRING_TRANSITION: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 25,
  restDelta: 0.001,
}

/** Short ease-out tween for scale/zoom transitions. */
export const ZOOM_EASE: Transition = {
  type: 'tween',
  ease: 'easeOut',
  duration: 0.25,
}

/**
 * Horizontal cross slide for the active panel. The incoming panel enters from the side the
 * user moved towards while the outgoing one leaves the opposite way, giving a swipe feel.
 * Distances are percentages so the motion scales with the panel width.
 */
export const SWIPE_VARIANTS: Variants = {
  enter: (direction: number) => ({ x: direction > 0 ? '35%' : '-35%', opacity: 0 }),
  center: { x: '0%', opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? '-35%' : '35%', opacity: 0 }),
}

/** Spring tuned to settle the swipe quickly without overshoot. */
export const SWIPE_TRANSITION: Transition = {
  type: 'spring',
  stiffness: 350,
  damping: 35,
  mass: 0.8,
}

/**
 * Edge springs for floating highlights (HoverHighlight, MenuHighlight). The edge facing
 * the direction of travel (leading) is stiffer than the one behind it (trailing), so the
 * highlight stretches toward the next item like a soft body before settling instead of
 * moving as a rigid box.
 */
export const HIGHLIGHT_LEAD_SPRING: Transition = { type: 'spring', stiffness: 500, damping: 36 }
export const HIGHLIGHT_TRAIL_SPRING: Transition = { type: 'spring', stiffness: 280, damping: 30 }

/** Near critical spring relaxing the highlight materialize scale into place without wobble. */
export const HIGHLIGHT_APPEAR_SPRING: Transition = { type: 'spring', stiffness: 380, damping: 30 }

/** Short opacity only fade so highlights ease in softly without their box animating. */
export const HIGHLIGHT_FADE_IN: Transition = { type: 'tween', duration: 0.2, ease: 'easeOut' }

/** Slightly longer fade for the exit so the highlight dissolves instead of vanishing. */
export const HIGHLIGHT_FADE_OUT: Transition = { type: 'tween', duration: 0.25, ease: 'easeOut' }
