import type { Transition } from 'framer-motion'

/** Standardized framer-motion configs for consistent interactions across the app. */
export const SPRING_TRANSITION: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
}

export const SMOOTH_SPRING_TRANSITION: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 25,
  restDelta: 0.001,
}

export const ZOOM_EASE: Transition = {
  type: 'tween',
  ease: [0.22, 1, 0.36, 1],
  duration: 0.4,
}
