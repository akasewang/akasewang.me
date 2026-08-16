import type { Transition, Variants } from 'framer-motion'

/**
 * The default spring, and what anything answering a press or a hover moves on: stiff enough to
 * arrive at once and damped enough that it does not visibly overshoot on the way.
 */
export const SPRING_TRANSITION: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
}

/**
 * The softer one, for movement nobody asked for directly: something settling into place as it
 * comes into view, or a value ticking over on its own. The tight restDelta keeps it running until
 * it is genuinely at rest rather than stopping a fraction short of the mark.
 */
export const SMOOTH_SPRING_TRANSITION: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 25,
  restDelta: 0.001,
}

/** Button labels follow the link arrow: the old face rises out as the next one rises in */
export const BUTTON_SWAP_TRANSITION: Transition = {
  type: 'tween',
  ease: 'easeOut',
  duration: 0.2,
}

/** A command view clears the frame before the next one enters, like a compact page transition. */
export const COMMAND_VIEW_EXIT_TRANSITION: Transition = {
  type: 'tween',
  duration: 0.16,
  ease: [0.55, 0, 0.85, 0],
}

/** The incoming command view settles firmly without making the text itself feel elastic. */
export const COMMAND_VIEW_ENTER_TRANSITION: Transition = {
  type: 'spring',
  stiffness: 380,
  damping: 30,
  mass: 0.75,
}

/** A slightly softer spring lets the command frame breathe as shorter and taller views replace it. */
export const COMMAND_CONTAINER_TRANSITION: Transition = {
  type: 'spring',
  stiffness: 320,
  damping: 24,
  mass: 0.85,
}

/**
 * Opening and closing a zoomed image. A tween rather than a spring, since a photo growing to fill
 * the screen should arrive and stop rather than bounce into place at that size.
 */
export const ZOOM_EASE: Transition = {
  type: 'tween',
  ease: 'easeOut',
  duration: 0.25,
}

/**
 * Tab panels travel in the direction the tab strip was moved, so a panel enters from the side it
 * was reached from and the one it replaced leaves the opposite way. A third of the width rather
 * than the whole of it, so a panel starts most of the way home and reads as a nudge across.
 */
export const SWIPE_VARIANTS: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '35%' : '-35%',
    opacity: 0,
  }),
  center: { x: '0%', opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? '-35%' : '35%',
    opacity: 0,
  }),
}

/**
 * Carries the swap above and the surrounding box resizing to the incoming panel, so the frame and
 * what it holds move on one spring instead of one finishing after the other.
 */
export const SWIPE_TRANSITION: Transition = {
  type: 'spring',
  stiffness: 350,
  damping: 35,
  mass: 0.8,
}

/** Shared with useCollapseScroll and with the duration-300 on ExpandableContent */
export const EXPAND_DURATION = 0.3

/** Opening and closing a collapsed list, on a curve that eases at both ends of the travel */
export const EXPAND_TRANSITION: Transition = {
  duration: EXPAND_DURATION,
  ease: 'easeInOut',
}

/**
 * The highlight box that follows the pointer down a list. Position runs on the lead spring and size
 * on the slower trail one, and the lag between the two is what stretches the box as it travels.
 */
export const HIGHLIGHT_LEAD_SPRING: Transition = {
  type: 'spring',
  stiffness: 500,
  damping: 36,
}
export const HIGHLIGHT_TRAIL_SPRING: Transition = {
  type: 'spring',
  stiffness: 280,
  damping: 30,
}

/** The box's first appearance, scaling up where it already sits rather than travelling in */
export const HIGHLIGHT_APPEAR_SPRING: Transition = {
  type: 'spring',
  stiffness: 380,
  damping: 30,
}

/** Quick enough that the box is already there by the time the pointer has finished arriving */
export const HIGHLIGHT_FADE_IN: Transition = {
  type: 'tween',
  duration: 0.2,
  ease: 'easeOut',
}

/** A touch longer than the fade in, so the box thins out behind the pointer rather than blinking off */
export const HIGHLIGHT_FADE_OUT: Transition = {
  type: 'tween',
  duration: 0.25,
  ease: 'easeOut',
}

/**
 * The opening reveal. Nothing moves: the count leaves digit by digit, the veil thins, and the page
 * resolves out of a blur, all overlapping so there is more than one curve to watch.
 */

/** How long the count takes to reach 100, and how long it sits there once it has */
export const REVEAL_COUNT_MS = 1150
export const REVEAL_HOLD_MS = 150

/** The count fading in at the start, and one digit thinning out at the end */
export const REVEAL_COUNT_IN_MS = 280
export const REVEAL_COUNT_OUT_MS = 320

/** The gap between one digit leaving and the next */
export const REVEAL_DIGIT_STAGGER_MS = 70

/** How long after the first digit goes before the veil starts down, and how long it takes */
export const REVEAL_FADE_LEAD_MS = 120
export const REVEAL_FADE_MS = 680

/** The blur the page resolves out of, finishing ahead of the veil so nothing sharpens in full view */
export const REVEAL_FOCUS_MS = 580
export const REVEAL_FOCUS_BLUR_PX = 14

/** Slack past the fade, so the loader unmounts after it lands rather than cutting its own tail */
export const REVEAL_SETTLE_MS = 40

/** A digit thins out where it stands, so it eases at both ends rather than leaving for anywhere */
export const REVEAL_COUNT_OUT_EASE = [0.4, 0, 0.6, 1] as const

/**
 * A beat of full cover, the page coming up through the middle, then a long quiet tail. An eased out
 * fade gives its cover away in the first frames instead, which is what made it read cheap. Shared
 * with the focus, so the page sharpens on the curve it brightens on.
 */
export const REVEAL_FADE_EASE = [0.6, 0, 0.25, 1] as const

/**
 * Route travel, measured against the viewport rather than the column. A page has to clear the screen
 * to read as a page leaving, and a share of the content column would only slide it into its own
 * margin.
 */
export const PAGE_SLIDE_X = 100
export const PAGE_SLIDE_Y = 100

/**
 * How long each half of a route change lasts and the curve it travels on, the two halves being the
 * old page leaving and the new one arriving.
 *
 * They run back to back rather than overlapping, so their curves are chosen for the speed they meet
 * at rather than for either curve alone: a departure ending at pace handed to an arrival
 * starting at pace is what carries one gesture across the seam. The arrival is the longer of the
 * two, covering most of its ground immediately so the screen never sits empty behind it, then
 * spending the rest settling.
 *
 * Both axes are spelled out. A vertical journey animates y and nothing else, so a config naming only
 * x leaves it on the library default, which is a different curve and a different length entirely.
 */
const PAGE_ENTER_MS = 540
const PAGE_EXIT_MS = 360
const PAGE_ENTER_EASE = [0.16, 1, 0.3, 1] as const
const PAGE_EXIT_EASE = [0.55, 0, 0.85, 0] as const

export const PAGE_ENTER_TRANSITION: Transition = {
  x: { type: 'tween', duration: PAGE_ENTER_MS / 1000, ease: PAGE_ENTER_EASE },
  y: { type: 'tween', duration: PAGE_ENTER_MS / 1000, ease: PAGE_ENTER_EASE },
  /** Arrives solid, a page sliding in having nothing to fade up from */
  opacity: { type: 'tween', duration: 0 },
}

export const PAGE_EXIT_TRANSITION: Transition = {
  x: { type: 'tween', duration: PAGE_EXIT_MS / 1000, ease: PAGE_EXIT_EASE },
  y: { type: 'tween', duration: PAGE_EXIT_MS / 1000, ease: PAGE_EXIT_EASE },
  opacity: {
    type: 'tween',
    duration: PAGE_EXIT_MS / 1000,
    ease: PAGE_EXIT_EASE,
  },
}

/**
 * How long each kind of arrival can legitimately take, plus a frame or two of slack.
 *
 * Arrival is what hides the elements a moving page would otherwise misplace, so the flag clearing is
 * load bearing rather than cosmetic: if the animation callback that clears it never lands, those
 * elements stay hidden for good. Under a reduced motion preference the slide is stripped down to
 * nothing, which is exactly the case where a callback is least certain to arrive, so these give the
 * flag a deadline it cannot outlive.
 */
export const PAGE_ARRIVAL_TIMEOUT_MS = PAGE_EXIT_MS + PAGE_ENTER_MS + 200
