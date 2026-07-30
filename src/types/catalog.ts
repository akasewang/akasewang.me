import type { CATALOG_CATEGORIES } from '@/constants/categories'

type FilterCategory = (typeof CATALOG_CATEGORIES)[number]['value']
export interface CatalogItem {
  title: string
  category: FilterCategory
  author?: string
}
