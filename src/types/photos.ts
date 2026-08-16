import type { PHOTO_CATEGORIES } from '@/constants/categories'

type Category = (typeof PHOTO_CATEGORIES)[number]['value']
/**
 * One photograph. The dimensions are required rather than measured, since the grid reserves each
 * frame's space before the image itself has loaded.
 */
export type Photo = {
  id: string
  url: string
  alt: string
  width: number
  height: number
  category?: Category
}
