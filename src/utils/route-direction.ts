type Direction = 1 | -1

/** A null byte joins the two paths, being the one character neither of them can contain */
const pairKey = (from: string, to: string) => `${from}\u0000${to}`

/**
 * Paths cannot express the editorial order between two posts. This tracker records both directions
 * of a journey when a previous/next control initiates it, so browser Back travels the inverse way.
 * Reading it during render is side-effect free, which keeps transition calculation safe under
 * concurrent and restarted React renders.
 */
function createSiblingDirectionTracker() {
  const known = new Map<string, Direction>()

  const mark = (direction: Direction, from: string, to: string) => {
    known.set(pairKey(from, to), direction)
    known.set(pairKey(to, from), direction === 1 ? -1 : 1)
  }

  const get = (from: string, to: string): Direction =>
    known.get(pairKey(from, to)) ?? (to > from ? 1 : -1)

  return { mark, get }
}

/** One tracker for the whole site, since the journeys it records span pages */
const siblingDirections = createSiblingDirectionTracker()

/** Record a journey before taking it */
export const markSiblingDirection = siblingDirections.mark

/** Read it back, falling out to alphabetical order for a pair never travelled before */
export const getSiblingDirection = siblingDirections.get
