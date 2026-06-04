import { CATALOG_CATEGORIES } from '@/constants/categories'

/** A catalog filter value (media type), derived from the catalog categories. */
export type FilterCategory = (typeof CATALOG_CATEGORIES)[number]['value']

/** A single catalog entry (bookmarks / reading list): a title, its media category, and optional author. */
export interface CatalogItem {
  title: string
  category: FilterCategory
  author?: string
}
