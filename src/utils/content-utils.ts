/**
 * The entries either side of one, for a post's previous and next controls. Lists arrive newest
 * first, so previous is the next index along. An entry not in the list gets neither, rather than
 * the ends of the list.
 */
export function getAdjacentContent<T extends { slug: string }>(items: T[], currentSlug: string) {
  const currentIndex = items.findIndex(({ slug }) => slug === currentSlug)

  if (currentIndex === -1) {
    return { previous: undefined, next: undefined }
  }

  return {
    previous: items[currentIndex + 1],
    next: currentIndex > 0 ? items[currentIndex - 1] : undefined,
  }
}
