/** Renders the social card for a page on demand, so no image is stored per route */

import { ImageResponse } from 'next/og'
import { INITIALS_PATH, INITIALS_VIEW_BOX, SITE_URL } from '@/constants/constants'

const OG_WIDTH = 1200
const OG_HEIGHT = 630

/**
 * The page's own `--background`, resolved to a form the card renderer accepts.
 *
 * The stylesheet states it in oklch, which is not a colour space ImageResponse knows, so it is
 * written out here in both notations the card needs: flat for the base fill, and as components for
 * the gradient that has to fade to it.
 */
const CARD_BACKGROUND = '#060608'
const CARD_BACKGROUND_RGB = '6, 6, 8'

/**
 * The same growth the site background draws, run once to a still.
 *
 * Every number that decides the shape is the background's own, because what makes the pattern
 * recognisable is its silhouette: a handful of long wandering arcs that thin into feathered tips. A
 * branch runs until its own coin flips end it, which is what lets one travel most of the way across
 * the frame before it dies.
 */
const BRANCH_LENGTH = 6
const BRANCH_SPREAD = Math.PI / 12
const MIN_BRANCH = 30
const BRANCH_STROKE = '#888888'

/**
 * The head start one path out of each branch gets before the coin flips decide everything.
 *
 * A per twig allowance, separate from the shared `counter` it travels beside: it follows one line
 * of descent down the branch, so a single path is carried to its full length whatever the twigs
 * around it do. `MIN_TRUNK_SEGMENT_LENGTH` holds those first segments off zero, so a path
 * guaranteed in segments is guaranteed on the card too.
 */
const MIN_TRUNK_SEGMENTS = 12
const MIN_TRUNK_SEGMENT_LENGTH = 0.75

/**
 * The amount of growth a finished card holds, and how far off its share a single branch may land.
 *
 * This growth is uneven by nature. Past `MIN_BRANCH` a segment sprouts twice at even odds, giving
 * it one descendant on average: the knife edge where a branch is as likely to die out as to keep
 * doubling. Total size across such a branch follows a power law, so over a frame this size one in
 * twenty finishes under three hundred segments while one in twenty passes thirty thousand. A
 * viewport carries that easily, being met one at a time and arriving animated. Cards are met
 * several at a time, where the same spread reads as some empty and others clogged.
 *
 * A branch landing far off its share is therefore discarded and grown again from a fresh start on
 * the same edge, until one lands near enough or the attempts run out. The growth itself is never
 * interfered with; all this picks is which of its outcomes is worth showing. A share is the card's
 * total split between however many branches it drew, which settles how much is grown while leaving
 * where it grows from free to vary.
 */
const TARGET_SEGMENTS = 16_000
const BRANCH_SHARE_MIN = 0.55
const BRANCH_SHARE_MAX = 1.5
const GROWTH_ATTEMPTS = 10

/**
 * Where the branches start, and how far along their edge they are allowed to sit.
 *
 * Held back from the corners, where a branch would only clip past on its way out of frame.
 */
const SEED_INSET_MIN = 0.2
const SEED_INSET_SPAN = 0.6

/**
 * How many branches a card gets, and how far each may lean off square to its edge.
 *
 * The page starts one per edge every time, which suits a viewport: it is a single thing to fill and
 * whoever loads it sees only that one. A feed shows several cards together, where a fixed count all
 * entering square would read as one layout redrawn. So the count, the edges used and the angle of
 * entry are drawn from the card's own seed, giving each card a composition of its own.
 */
const SEED_COUNT_MIN = 3
const SEED_COUNT_SPAN = 3
const SEED_LEAN = Math.PI / 14

/**
 * How much heavier the stroke is here than on the page.
 *
 * The page draws its hairlines at full size on a screen. A card is usually met at a third of its
 * size in a feed, where those would drop below one pixel and disappear entirely, so the same colour
 * is carried at a higher opacity to survive the downscale.
 */
const BRANCH_WIDTH = 1
const BRANCH_OPACITY = 0.2

/**
 * How many separate paths the segments are shared out between.
 *
 * This is what gives the drawing its texture. An SVG path is painted in one pass, so segments
 * within the same path never deepen where they cross, and a whole branch in one path comes out a
 * flat grey however dense it is. Spread across several paths, each is painted in turn and crossings
 * build up. They are dealt round robin, so consecutive segments always land in different paths and
 * a joint reads heavier than the line either side of it.
 */
const BRANCH_LAYERS = 16

/**
 * A random number generator fixed to a piece of text.
 *
 * The card is drawn fresh on every request, so an unseeded generator would hand a different picture
 * to every crawler that asks. Seeding from the card's own words keeps one page looking the same
 * every time while two different pages still look different from each other.
 */
function createRandom(seed: string) {
  let hash = 2166136261

  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }

  let state = hash >>> 0

  return () => {
    state = (state + 0x6d2b79f5) | 0
    let drawn = Math.imul(state ^ (state >>> 15), 1 | state)
    drawn = (drawn + Math.imul(drawn ^ (drawn >>> 7), 61 | drawn)) ^ drawn
    return ((drawn ^ (drawn >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * `counter` is shared by every twig descended from one seed, because the branching rate is meant to
 * ease off as the branch as a whole fills out. `trunk` is per twig, and is what is left of the
 * guaranteed run on this particular line of descent.
 */
type Branch = {
  x: number
  y: number
  angle: number
  counter: { value: number }
  trunk: number
}

/** Where one branch starts and which way it heads */
type Seed = { x: number; y: number; angle: number }

/**
 * Picks how many branches this card gets and which edge each one grows from.
 *
 * The edges are shuffled rather than drawn independently, so a card with three branches is missing
 * a different side each time instead of repeatedly dropping the same one, and a card with five
 * doubles up on a side it chose.
 */
function planEdges(random: () => number): number[] {
  const edges = [0, 1, 2, 3]

  for (let index = edges.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1))
    ;[edges[index], edges[swap]] = [edges[swap], edges[index]]
  }

  const count = SEED_COUNT_MIN + Math.floor(random() * SEED_COUNT_SPAN)

  return Array.from({ length: count }, (_, index) => edges[index % edges.length])
}

/**
 * Puts one start somewhere along the given edge, aimed inward with a lean of its own.
 *
 * Called once per attempt at a branch, so every attempt is a fresh branch from a fresh point on
 * that edge. The lean stays small because a branch entering at a shallow angle leaves the frame
 * again before it can grow into anything.
 */
function placeSeed(edge: number, random: () => number): Seed {
  const along = () => random() * SEED_INSET_SPAN + SEED_INSET_MIN
  const lean = () => (random() - 0.5) * 2 * SEED_LEAN

  if (edge === 0) return { x: along() * OG_WIDTH, y: -5, angle: Math.PI / 2 + lean() }
  if (edge === 1) return { x: along() * OG_WIDTH, y: OG_HEIGHT + 5, angle: -Math.PI / 2 + lean() }
  if (edge === 2) return { x: -5, y: along() * OG_HEIGHT, angle: lean() }
  return { x: OG_WIDTH + 5, y: along() * OG_HEIGHT, angle: Math.PI + lean() }
}

/**
 * Grows one branch inward from its edge and returns its segments as path data.
 *
 * A branch ends where the page's ends it: when it wanders far enough outside the frame that nothing
 * it draws could come back, or when neither coin flip sprouts a descendant. Its length rests on
 * those two alone, which is what lets the long arcs form.
 *
 * `ceiling` bounds the work, not the shape. A branch reaching it has overshot its share by more
 * than a regrowth would, so the caller discards these segments; growth stops there because nothing
 * further can be learned from it, not to bring the branch to a size.
 *
 * Growth advances a generation at a time, since every descendant of a branch takes its step before
 * any of them takes a second. The page additionally postpones half of them at random, which
 * staggers its animation across frames but cannot move a segment, so a still has no use for it.
 */
function growBranch(seed: Seed, random: () => number, ceiling: number): string[] {
  const segments: string[] = []
  const counter = { value: 0 }
  let living: Branch[] = [
    { x: seed.x, y: seed.y, angle: seed.angle, counter, trunk: MIN_TRUNK_SEGMENTS },
  ]

  while (living.length > 0 && segments.length <= ceiling) {
    const next: Branch[] = []

    for (const branch of living) {
      if (segments.length > ceiling) break

      const minLength = branch.trunk > 0 ? MIN_TRUNK_SEGMENT_LENGTH : 0
      const length = minLength + random() * (BRANCH_LENGTH - minLength)

      branch.counter.value += 1

      const nextX = branch.x + length * Math.cos(branch.angle)
      const nextY = branch.y + length * Math.sin(branch.angle)

      segments.push(
        `M${branch.x.toFixed(1)} ${branch.y.toFixed(1)}L${nextX.toFixed(1)} ${nextY.toFixed(1)}`,
      )

      if (nextX < -100 || nextX > OG_WIDTH + 100 || nextY < -100 || nextY > OG_HEIGHT + 100) {
        continue
      }

      const rate = branch.counter.value <= MIN_BRANCH ? 0.8 : 0.5
      const nextTrunk = Math.max(0, branch.trunk - 1)

      const sprout = (turn: number, trunk: number) =>
        next.push({
          x: nextX,
          y: nextY,
          angle: branch.angle + turn,
          counter: branch.counter,
          trunk,
        })

      /** Only the first descendant inherits what is left of the run, keeping it to one path */
      if (branch.trunk > 1 || random() < rate) sprout(random() * BRANCH_SPREAD, nextTrunk)
      if (random() < rate) sprout(-random() * BRANCH_SPREAD, 0)
    }

    living = next
  }

  return segments
}

/**
 * Grows the card's branches and deals their segments out to the layers.
 *
 * Each branch is regrown from a fresh start until one lands near its share, or until the attempts
 * run out, in which case the closest of them is taken so a card is never left short of a branch it
 * planned. Dealing happens once a branch is settled, so nothing a discarded attempt drew reaches
 * the drawing.
 */
function buildBranchLayers(random: () => number) {
  const layers: string[][] = Array.from({ length: BRANCH_LAYERS }, () => [])
  let dealt = 0

  const edges = planEdges(random)
  const share = TARGET_SEGMENTS / edges.length
  const floor = Math.round(share * BRANCH_SHARE_MIN)
  const ceiling = Math.round(share * BRANCH_SHARE_MAX)

  for (const edge of edges) {
    let best: string[] = []
    let bestMiss = Number.POSITIVE_INFINITY

    for (let attempt = 0; attempt < GROWTH_ATTEMPTS; attempt += 1) {
      const grown = growBranch(placeSeed(edge, random), random, ceiling)
      const size = grown.length
      const miss = size < floor ? floor - size : Math.max(0, size - ceiling)

      if (miss < bestMiss) {
        best = grown
        bestMiss = miss
      }

      if (miss === 0) break
    }

    for (const segment of best) {
      layers[dealt % BRANCH_LAYERS].push(segment)
      dealt += 1
    }
  }

  return layers
}

/**
 * Builds the whole pattern as one SVG data URI, ready to use as a background image.
 *
 * Base64 encoded because path data is mostly commas, spaces and letters that percent encoding would
 * expand several times over.
 */
function buildBranchBackground(seed: string) {
  const paths = buildBranchLayers(createRandom(seed))
    .filter((layer) => layer.length > 0)
    .map((layer) => `<path d="${layer.join('')}"/>`)
    .join('')

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${OG_WIDTH}" height="${OG_HEIGHT}"><g fill="none" stroke="${BRANCH_STROKE}" stroke-opacity="${BRANCH_OPACITY}" stroke-width="${BRANCH_WIDTH}">${paths}</g></svg>`

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

/**
 * ImageResponse needs real font bytes, which means resolving the woff2 URL out of the stylesheet
 * first. Only the glyphs in the requested text are asked for, keeping the download small enough to
 * fetch on every render.
 */
async function loadGoogleFont(family: string, weight: number, text: string, italic = false) {
  const axis = italic ? `ital,wght@1,${weight}` : `wght@${weight}`
  const url = `https://fonts.googleapis.com/css2?family=${family.replace(
    / /g,
    '+',
  )}:${axis}&text=${encodeURIComponent(text)}`

  const cssResponse = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/537.36',
    },
  })

  if (!cssResponse.ok) throw new Error(`Could not load ${family} CSS`)

  const css = await cssResponse.text()
  const src = css.match(/src: url\((.+?)\) format\('(woff2|opentype|truetype)'\)/)
  if (!src?.[1]) throw new Error(`Could not load ${family} ${weight}`)

  const fontResponse = await fetch(src[1])
  if (!fontResponse.ok) throw new Error(`Could not load ${family} font file`)

  return fontResponse.arrayBuffer()
}

/**
 * Draws the share card for whatever page asked for it. Title and type come in as query parameters
 * and are both clipped, since anything reaching here is a URL someone can write by hand.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const hasTitle = searchParams.has('title')

    const title = hasTitle
      ? (searchParams.get('title')?.trim().slice(0, 100) ?? '')
      : 'My work is better than this tagline.'

    const type = searchParams.get('type')?.trim().slice(0, 50)
    const domain = new URL(SITE_URL).host
    const eyebrow = (type ? `${domain} / ${type}` : domain).toLowerCase()

    const [ptSerif, interReg] = await Promise.all([
      loadGoogleFont('PT Serif', 400, title, true),
      loadGoogleFont('Inter', 400, eyebrow),
    ])

    return new ImageResponse(
      <div
        style={{
          position: 'relative',
          height: '100%',
          width: '100%',
          display: 'flex',
          backgroundColor: CARD_BACKGROUND,
          backgroundImage: `url("${buildBranchBackground(`${title}|${eyebrow}`)}")`,
          padding: '88px',
        }}
      >
        {/**
         * Sits over the pattern, holding clean ground under the words and clearing toward the
         * edges, the same way the page masks its own middle away.
         *
         * A branch is free to grow anywhere, so on some cards one lands squarely behind the title.
         * The overlay therefore holds full strength across the whole text block before it begins to
         * fade, which keeps those cards reading like any other, while the pattern is still met at
         * full strength further out where there is nothing to compete with.
         */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            background: `radial-gradient(ellipse 82% 92% at 30% 50%, ${CARD_BACKGROUND} 0%, ${CARD_BACKGROUND} 34%, rgba(${CARD_BACKGROUND_RGB}, 0.78) 58%, rgba(${CARD_BACKGROUND_RGB}, 0) 100%)`,
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontFamily: 'PT Serif',
                fontStyle: 'italic',
                fontSize: hasTitle ? 84 : 76,
                fontWeight: 400,
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                color: '#ffffff',
                maxWidth: '860px',
                textWrap: 'balance',
              }}
            >
              {title}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontFamily: 'Inter',
              fontSize: 18,
              fontWeight: 400,
              letterSpacing: '0.08em',
            }}
          >
            {type ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#737373' }}>{domain.toLowerCase()}</span>
                <span style={{ color: '#404040', margin: '0 12px' }}>/</span>
                <span style={{ color: '#d4d4d4' }}>{type.toLowerCase()}</span>
              </div>
            ) : (
              <span style={{ color: '#737373' }}>{domain.toLowerCase()}</span>
            )}

            {/**
             * The site's mark, opposite the domain so the foot of the card is anchored at both ends.
             *
             * Drawn as a plain stroked path rather than through the icon component, the card renderer
             * having no React tree and no stylesheet to read: the class that animates it on the page
             * would mean nothing here, and without it the same path simply renders fully drawn, which
             * is what a still of it should be anyway. Stroked at the same width as the page draws it,
             * the card being large enough that the mark needs no thickening to survive the scale down.
             */}
            <svg
              viewBox={INITIALS_VIEW_BOX}
              width={52}
              height={52}
              fill="none"
              stroke="#d4d4d4"
              strokeWidth={1}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d={INITIALS_PATH} />
            </svg>
          </div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
        fonts: [
          { name: 'PT Serif', data: ptSerif, weight: 400, style: 'italic' },
          { name: 'Inter', data: interReg, weight: 400, style: 'normal' },
        ],
      },
    )
  } catch {
    return new Response('Failed to generate image', { status: 500 })
  }
}
