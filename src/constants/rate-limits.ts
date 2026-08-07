/**
 * How long a visitor waits between submissions, in seconds. Each value is read on both sides: the
 * server claims a window of this length and refuses anything that arrives inside it, and the form
 * counts the same number down on its button, so the wait a visitor watches is the wait actually
 * enforced rather than a guess at it.
 */

/**
 * Newsletter signup. Claimed before the address is looked up, so attempts are spaced out at one
 * rate whatever the address turns out to be.
 */
export const SUBSCRIBE_COOLDOWN_SECONDS = 60

/**
 * Posting to the message board. The form starts this countdown once a post lands, holding the
 * submit button for as long as the server would turn the next one away.
 */
export const MESSAGE_BOARD_COOLDOWN_SECONDS = 120
