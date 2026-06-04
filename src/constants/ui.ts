import type { Transition } from 'framer-motion'

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

/** Softer, lower-stiffness spring for fluid gliding motion (e.g. the hover highlight). */
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
