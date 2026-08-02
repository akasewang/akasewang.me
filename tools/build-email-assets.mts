/**
 * Rasterises the artwork the emails need.
 *
 * Gmail, Outlook and Yahoo all drop inline SVG and refuse data URIs, so the one format that
 * actually reaches every inbox is a PNG served from a URL.
 *
 * Run with npx tsx tools/build-email-assets.mts after editing a source file.
 *
 * brand-mark.svg sits beside these outputs and is deliberately not one of their sources. It was
 * rasterised for a header the templates no longer carry, and it is kept as the only copy of the
 * mark rather than as something this script has a reason to read.
 */

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Acorn, Bread, Lego } from '@phosphor-icons/react/dist/ssr'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import sharp from 'sharp'

/** Twice the 30px the signature renders it at */
const AVATAR_SIZE = 60
/**
 * --surface-50, the band the avatar sits on. The circle is cut into an opaque square of it rather
 * than left transparent, because border-radius does not reach Outlook and a transparent corner is
 * the thing a client's dark mode filter grabs hold of. Matching the band makes the square invisible.
 */
const AVATAR_BACKDROP = '#0f0f0f'
/**
 * A nearly full-frame square keeps the whole blue head visible with an even white margin around it.
 * The earlier 800px crop pushed the head against the circular mask and made the 30px rendering look
 * zoomed in. Trimming 32px from each side recentres the subject while leaving the excess shirt out.
 */
const AVATAR_WINDOW = { left: 32, top: 0, width: 960, height: 960 }

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const assetsDir = path.join(rootDir, 'public', 'email')

/**
 * The portrait beside the signature, cut to a circle here so no client has to round it. A photo is
 * left as it is by the dark mode filters that recolour flat artwork, which is the other reason this
 * is a photograph on an opaque square rather than a masked transparent PNG.
 */
const avatarMask = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${AVATAR_SIZE}" height="${AVATAR_SIZE}"><circle cx="${AVATAR_SIZE / 2}" cy="${AVATAR_SIZE / 2}" r="${AVATAR_SIZE / 2}" fill="#ffffff" /></svg>`,
)

/** The window fills the frame edge to edge, so the circle crops it rather than padding it */
const circularPortrait = await sharp(path.join(rootDir, 'public', 'profpic.jpg'))
  .extract(AVATAR_WINDOW)
  .resize(AVATAR_SIZE, AVATAR_SIZE, { fit: 'cover' })
  .composite([{ input: avatarMask, blend: 'dest-in' }])
  .png()
  .toBuffer()

const avatar = await sharp({
  create: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    channels: 4,
    background: AVATAR_BACKDROP,
  },
})
  .composite([{ input: circularPortrait }])
  .png({ compressionLevel: 9 })
  .toFile(path.join(assetsDir, 'avatar.png'))

console.log(`Wrote email/avatar.png at ${avatar.width}x${avatar.height}`)

/**
 * The halftone field carrying the newsletter off the card and down onto the page. Dots on a fixed
 * grid grow row by row until their edges close over one another and none of the card is left
 * showing. Rasterising the dissolve is what makes it dependable, since Gmail and Outlook both drop
 * a CSS gradient and both draw a PNG.
 *
 * The ramp is set by how much of a cell the ink covers rather than by the radius. Coverage is what
 * the eye reads as tone and it grows with the square of the radius, so a radius climbing evenly
 * leaves the field barely marked down most of its height and then shuts it in the last row or two.
 * Each row is handed a coverage instead and the radius reaching it is solved for.
 */
const FOOTER_TRANSITION_WIDTH = 1200
const FOOTER_TRANSITION_HEIGHT = 192
/** 6px on screen: fine enough for sixteen steps of tone, coarse enough to still read as a grid */
const FOOTER_TRANSITION_CELL = 12
const FOOTER_TRANSITION_CARD = '#0f0f0f'
const FOOTER_TRANSITION_PAGE = '#030303'

/**
 * How much of one cell a dot centred in it covers. Out to half the cell that is the disc's own area.
 * Past that it hangs over the four edges, so the four segments lying outside come back off it, and
 * past the half diagonal there is none of the cell left.
 */
const cellCoverage = (radius: number, cell: number) => {
  const half = cell / 2
  if (radius <= 0) return 0
  if (radius >= half * Math.SQRT2) return 1

  const disc = Math.PI * radius ** 2
  if (radius <= half) return disc / cell ** 2

  const segment = radius ** 2 * Math.acos(half / radius) - half * Math.sqrt(radius ** 2 - half ** 2)
  return (disc - 4 * segment) / cell ** 2
}

/**
 * The radius covering a given share of a cell. Once the dot is over the cell edges there is nothing
 * closed form to invert, and bisecting a curve this smooth is well inside a thousandth of a pixel
 * long before the loop is out.
 */
const radiusForCoverage = (coverage: number, cell: number) => {
  const merged = (cell / 2) * Math.SQRT2
  /**
   * Any radius past the half diagonal fills the cell. A closed row is drawn a hair beyond it rather
   * than exactly on it, where the corners of the cell sit on the circle itself and an antialiased
   * edge can leave a sliver of card behind.
   */
  if (coverage >= 1) return merged + 0.5

  let low = 0
  let high = merged
  for (let step = 0; step < 40; step += 1) {
    const mid = (low + high) / 2
    if (cellCoverage(mid, cell) < coverage) low = mid
    else high = mid
  }

  return high
}

/** Flat at both ends, so the first dots surface out of the card and the last settle into the page */
const smoothstep = (t: number) => t ** 2 * (3 - 2 * t)

const transitionColumns = FOOTER_TRANSITION_WIDTH / FOOTER_TRANSITION_CELL
const transitionRows = FOOTER_TRANSITION_HEIGHT / FOOTER_TRANSITION_CELL
const transitionDots = Array.from({ length: transitionRows }, (_, row) => {
  /**
   * Counted off the row after the first, so the top row carries a speck rather than nothing and the
   * bottom row lands on full coverage, closing the field flush against the footer band below it.
   */
  const radius = radiusForCoverage(smoothstep((row + 1) / transitionRows), FOOTER_TRANSITION_CELL)
  const cy = row * FOOTER_TRANSITION_CELL + FOOTER_TRANSITION_CELL / 2

  return Array.from({ length: transitionColumns }, (_, column) => {
    const cx = column * FOOTER_TRANSITION_CELL + FOOTER_TRANSITION_CELL / 2
    return `<circle cx="${cx}" cy="${cy}" r="${radius.toFixed(3)}" />`
  }).join('')
}).join('')

const footerTransitionSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${FOOTER_TRANSITION_WIDTH}" height="${FOOTER_TRANSITION_HEIGHT}">
  <rect width="100%" height="100%" fill="${FOOTER_TRANSITION_CARD}" />
  <g fill="${FOOTER_TRANSITION_PAGE}">${transitionDots}</g>
</svg>`

const footerTransition = await sharp(Buffer.from(footerTransitionSvg))
  .png({ compressionLevel: 9 })
  .toFile(path.join(assetsDir, 'footer-transition.png'))

console.log(
  `Wrote email/footer-transition.png at ${footerTransition.width}x${footerTransition.height}`,
)

/**
 * The marks leading the rows of the newsletter's index, taken from the same Phosphor set the site
 * draws its icons from so the email is not carrying a second icon language. One per row rather than
 * one repeated, which is what stops the list reading as a plain bulleted list.
 *
 * Duotone is two paths, a solid one at 20% behind a detailed one at full, which no mail client will
 * render as SVG. Rasterising them here is what lets the email use the real icons rather than glyphs
 * standing in for them, and the colour is baked in because a PNG has no currentColor to inherit.
 */
const LINK_MARKS = [Acorn, Bread, Lego]
const ICON_WEIGHT = 'duotone' as const
const ICON_SIZE = 32
/** --muted-foreground, matching the label that heads the section the icons sit under */
const ICON_COLOR = '#737373'

for (const [index, Icon] of LINK_MARKS.entries()) {
  const iconSvg = renderToStaticMarkup(
    createElement(Icon, { weight: ICON_WEIGHT, color: ICON_COLOR, size: ICON_SIZE }),
  )

  const fileName = `link-mark-${index + 1}.png`
  const icon = await sharp(Buffer.from(iconSvg), { density: 288 })
    .resize(ICON_SIZE, ICON_SIZE)
    .png({ compressionLevel: 9 })
    .toFile(path.join(assetsDir, fileName))

  console.log(`Wrote email/${fileName} at ${icon.width}x${icon.height}`)
}

/**
 * The site name set as a wordmark, cut across the middle, with only the upper half kept. It closes
 * the email half sunk below its own bottom edge, so the name is legible without being spelled out.
 *
 * The cut has to land inside the x-height, where every letter has ink on both sides of it. Higher
 * and the short letters come away whole, which leaves the half that is kept carrying almost nothing.
 *
 * Type is drawn at a size the rasteriser is comfortable with and scaled to the measure afterwards,
 * for the same reason the earlier wordmark had to be: librsvg ignores textLength, so asking the SVG
 * to both set the type and fit the measure clips the last glyph wherever the metrics run wide.
 */
const WORDMARK_TEXT = 'akasewang.me'
/**
 * 2x the full 600px card. The mark runs the whole width rather than sitting inside the gutters the
 * rest of the email keeps to, which is what lets it read as a masthead and not as a line of copy.
 */
const WORDMARK_WIDTH = 1200
/**
 * How much of the ink height is kept, measured from the top. Two thirds, so the letters are cut
 * below their x-height rather than through it: enough of each one survives to be read at a glance,
 * with only the feet left below the edge.
 */
const WORDMARK_CUT = 0.67
/**
 * A step below even --muted-foreground, and well below the body copy. At full card width the mark
 * would take the page off the writing at any normal weight, so it is set to be sensed rather than
 * read. The alt carries the name for anyone the contrast does not.
 */
const WORDMARK_INK = '#242424'

const wordmarkSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="3000" height="520">
  <text x="20" y="380" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="380" letter-spacing="-18" fill="${WORDMARK_INK}">${WORDMARK_TEXT}</text>
</svg>`

const wordmarkFull = await sharp(Buffer.from(wordmarkSvg), { density: 72 })
  .trim()
  .resize({ width: WORDMARK_WIDTH })
  .png()
  .toBuffer()

const { height: shapeHeight = 0 } = await sharp(wordmarkFull).metadata()
/**
 * Rounded to an even number of pixels. The file is drawn at twice the size it is shown at, so an odd
 * height leaves the mark half a pixel tall once halved, and the width and height Outlook sizes an
 * image from have to be whole. Rounding to the nearest pixel there gave a tag half a percent taller
 * than the file it points at, which is a stretch nobody asked the mark for.
 */
const cutAt = Math.round((shapeHeight * WORDMARK_CUT) / 2) * 2

/**
 * Cropped to its own ink with no padding below it, so the cut edge sits hard against the bottom of
 * the file. That is what lets it close the email against its bottom edge rather than floating above
 * it with a margin the reader can see.
 */
const wordmarkFoot = await sharp(wordmarkFull)
  .extract({ left: 0, top: 0, width: WORDMARK_WIDTH, height: cutAt })
  .png({ compressionLevel: 9 })
  .toFile(path.join(assetsDir, 'wordmark-foot.png'))

console.log(`Wrote email/wordmark-foot.png at ${wordmarkFoot.width}x${wordmarkFoot.height}`)
