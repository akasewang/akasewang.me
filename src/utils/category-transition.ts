/**
 * How one change of category moves. Only a direction, where a route change also has an axis to
 * settle, for the reason given below.
 */
export type CategoryTravel = {
  sign: 1 | -1
}

/**
 * Works out which way a panel should travel, so movement matches where the reader went.
 *
 * The choices in a filter are siblings: the same section at the same depth, which is the case
 * resolvePageTravel answers with a sideways travel whose direction is the order the two sit in.
 * There is no axis to decide here, then, only a sign.
 *
 * Where a route change has to be told its sibling direction, because two paths alone cannot express
 * content order, a filter needs no telling: its chips are already in a row the eye reads left to
 * right, and that row is the order. A value the row does not hold reads as forward, which is what
 * the first render wants and the only thing an unknown one could reasonably mean.
 */
export function resolveCategoryTravel(
  from: string,
  to: string,
  order: readonly string[],
): CategoryTravel {
  const fromIndex = order.indexOf(from)
  const toIndex = order.indexOf(to)

  if (fromIndex === -1 || toIndex === -1) return { sign: 1 }

  return { sign: toIndex >= fromIndex ? 1 : -1 }
}
