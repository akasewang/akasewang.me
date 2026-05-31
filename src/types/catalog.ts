import { CATALOG_CATEGORIES } from '@/constants/categories'

/** Content schema for the top landing banner and intro text in the catalog section. */
export type FilterCategory = (typeof CATALOG_CATEGORIES)[number]['value']

export interface CatalogItem {
  title: string
  category: FilterCategory
  author?: string
}
