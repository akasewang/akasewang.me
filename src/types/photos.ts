import { PHOTO_CATEGORIES } from '@/constants/categories'

/** A photo's category, derived from the photo filter options (captured, generated, sketched…). */
export type Category = (typeof PHOTO_CATEGORIES)[number]['value']

/** A single gallery image: its source, alt text, intrinsic dimensions and optional category. */
export type Photo = {
  /** Stable unique identifier, used as a React key. */
  id: string
  /** Path to the image file under `public`. */
  url: string
  /** Alt text describing the image for accessibility and SEO. */
  alt: string
  /** Intrinsic pixel width, used to reserve layout space and size the optimizer. */
  width: number
  /** Intrinsic pixel height, used to reserve layout space and size the optimizer. */
  height: number
  /** Optional category the gallery filter groups the photo under. */
  category?: Category
}
