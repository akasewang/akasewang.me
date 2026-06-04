import { PHOTO_CATEGORIES } from '@/constants/categories'

/** A photo's category, derived from the photo filter options (captured, generated, sketched…). */
export type Category = (typeof PHOTO_CATEGORIES)[number]['value']

/** A single gallery image: its source, alt text, intrinsic dimensions, and optional category. */
export type Photo = {
  id: string
  url: string
  alt: string
  width: number
  height: number
  category?: Category
}
