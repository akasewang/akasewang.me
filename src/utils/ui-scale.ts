/**
 * The interface scale, for the few sizes that cannot be written as CSS.
 *
 * `--ui-scale` in `globals.css` is the one place the figure is set, and everything laid out in CSS
 * follows it on its own. A size that lands in markup instead has no way to read it: an `img`
 * element's `sizes` can be consulted by the browser's preload scanner before a stylesheet exists,
 * so it cannot use the custom property. `next.config.ts` reads the figure out of the stylesheet at
 * build time and hands it here, which keeps those lengths correct without a second place to remember.
 */
function readScale(): number {
  const parsed = Number(process.env.NEXT_PUBLIC_UI_SCALE)

  /**
   * Anything that is not a positive finite number falls back to drawing at natural size. The build
   * only ever writes a figure it has already checked, but this is where a value from outside the
   * project would arrive, an environment of the same name being enough, and a negative or infinite
   * scale would otherwise reach the markup as a negative or infinite width.
   */
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1
}

const UI_SCALE = readScale()

/**
 * A width at the reader's base size, restated as the rem length it is actually drawn at.
 *
 * Keeping the result in rem makes an image's `sizes` hint follow the reader's browser font size just
 * like the CSS layout does. Relative units in a sizes media condition resolve against the browser's
 * initial font size, so the responsive threshold follows the same preference too.
 */
export function scaledRem(basePx: number): string {
  if (!Number.isFinite(basePx) || basePx <= 0) {
    throw new RangeError('A scalable width must be a positive finite number.')
  }

  return `${(basePx / 16) * UI_SCALE}rem`
}
