import type { Transition, Variants } from 'framer-motion'

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
  ease: 'easeOut',
  duration: 0.25,
}

export const SWIPE_VARIANTS: Variants = {
  enter: (direction: number) => ({ x: direction > 0 ? '35%' : '-35%', opacity: 0 }),
  center: { x: '0%', opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? '-35%' : '35%', opacity: 0 }),
}

export const SWIPE_TRANSITION: Transition = {
  type: 'spring',
  stiffness: 350,
  damping: 35,
  mass: 0.8,
}

/** Shared with useCollapseScroll and with the duration-300 on ExpandableContent */
export const EXPAND_DURATION = 0.3

export const EXPAND_TRANSITION: Transition = { duration: EXPAND_DURATION, ease: 'easeInOut' }

export const HIGHLIGHT_LEAD_SPRING: Transition = { type: 'spring', stiffness: 500, damping: 36 }
export const HIGHLIGHT_TRAIL_SPRING: Transition = { type: 'spring', stiffness: 280, damping: 30 }

export const HIGHLIGHT_APPEAR_SPRING: Transition = { type: 'spring', stiffness: 380, damping: 30 }

export const HIGHLIGHT_FADE_IN: Transition = { type: 'tween', duration: 0.2, ease: 'easeOut' }

export const HIGHLIGHT_FADE_OUT: Transition = { type: 'tween', duration: 0.25, ease: 'easeOut' }
