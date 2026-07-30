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

export function followPointer(
  current: { x: number; y: number; primed: boolean },
  target: { x: number; y: number },
  smoothing: number,
) {
  if (!current.primed) {
    current.x = target.x
    current.y = target.y
    current.primed = true
    return
  }

  current.x += (target.x - current.x) * smoothing
  current.y += (target.y - current.y) * smoothing
}
