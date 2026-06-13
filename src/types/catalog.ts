import { CATALOG_CATEGORIES } from '@/constants/categories'

/** A catalog filter value (media type), derived from the catalog categories. */
export type FilterCategory = (typeof CATALOG_CATEGORIES)[number]['value']

/** A single catalog entry (bookmarks / reading list): a title, its media category and optional author. */
export interface CatalogItem {
  /** Title of the book, film or other media. */
  title: string
  /** Media category the catalog filter groups the entry under. */
  category: FilterCategory
  /** Optional creator (author, director and so on). */
  author?: string
}
