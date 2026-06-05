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

/**
 * Horizontal cross-slide for the active panel. The incoming panel enters from the side the
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
