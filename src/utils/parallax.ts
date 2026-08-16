/** The card-media zoom creates the spare edge area that magnetic drift can safely use. */
export const PROJECT_MEDIA_ZOOM = 1.03

const SLACK_USAGE = 0.8

interface PointerPosition {
  x: number
  y: number
}

interface ElementBounds {
  left: number
  top: number
  width: number
  height: number
}

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))

/**
 * Converts a pointer position into a bounded media offset. Only part of the zoom-created slack is
 * used, so rounding and fractional card sizes can never reveal the surface behind the medium.
 */
export function getParallaxOffset(
  pointer: PointerPosition,
  bounds: ElementBounds,
  zoom = PROJECT_MEDIA_ZOOM,
) {
  if (bounds.width <= 0 || bounds.height <= 0 || zoom <= 1) return { x: 0, y: 0 }

  const driftRatio = ((zoom - 1) / 2) * SLACK_USAGE
  const fromCentreX = clamp((pointer.x - bounds.left) / bounds.width - 0.5, -0.5, 0.5)
  const fromCentreY = clamp((pointer.y - bounds.top) / bounds.height - 0.5, -0.5, 0.5)

  return {
    x: fromCentreX * bounds.width * driftRatio * 2,
    y: fromCentreY * bounds.height * driftRatio * 2,
  }
}
