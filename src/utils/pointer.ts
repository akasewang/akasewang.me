/**
 * Whether the device has a real hovering pointer. Guards hover only affordances so they are not
 * built for a touchscreen, where hover styles stick after a tap.
 */
export function canUseHover() {
  if (typeof window === 'undefined' || !window.matchMedia) return false

  return window.matchMedia('(hover: hover) and (pointer: fine)').matches
}

/** Same question for a specific pointer event, since a hybrid device reports both kinds */
export function canUseHoverPointer(pointerType: string) {
  return pointerType === 'mouse' && canUseHover()
}
