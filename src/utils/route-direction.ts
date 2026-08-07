/**
 * Which way a move between two siblings is going. Paths alone cannot say: one post slug tells you
 * nothing about whether the next one sits before or after it, so whatever triggered the move has to
 * say. Only the sibling case reads this, and only the previous and next controls ever set it, so a
 * value left over from an earlier move can never be applied to the wrong kind of journey.
 */
let siblingDirection = 1

export const markSiblingDirection = (direction: 1 | -1) => {
  siblingDirection = direction
}

export const getSiblingDirection = () => siblingDirection
