import type { CATALOG_CATEGORIES } from '@/constants/categories'

type FilterCategory = (typeof CATALOG_CATEGORIES)[number]['value']
/** One entry in the catalogue. Author is optional, since a film or a game rarely has one */
export interface CatalogItem {
  title: string
  category: FilterCategory
  author?: string
}
