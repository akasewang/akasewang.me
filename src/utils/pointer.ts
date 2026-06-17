export function canUseHover() {
  if (typeof window === 'undefined' || !window.matchMedia) return false

  return window.matchMedia('(hover: hover) and (pointer: fine)').matches
}

export function canUseHoverPointer(pointerType: string) {
  return pointerType === 'mouse' && canUseHover()
}
