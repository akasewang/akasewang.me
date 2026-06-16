import type { PHOTO_CATEGORIES } from '@/constants/categories'

export type Category = (typeof PHOTO_CATEGORIES)[number]['value']
export type Photo = {
  id: string
  url: string
  alt: string
  width: number
  height: number
  category?: Category
}
