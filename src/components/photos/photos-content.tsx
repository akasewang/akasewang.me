'use client'

import { useMemo, useState, useCallback, memo } from 'react'
import Image from 'next/image'
import { useSearchParams, usePathname } from 'next/navigation'
import { m } from 'framer-motion'
import { cn } from '@/utils/utils'
import { Icons } from '@/components/ui/icons'
import { photos } from '@/data/static/photos'
import { CategoryFilter } from '@/components/common/category-filter'
import { EmptyState } from '@/components/common/empty-state'
import { ZOOM_EASE } from '@/constants/ui'
import { PHOTO_CATEGORIES } from '@/constants/categories'
import type { Photo, Category } from '@/types/photos'
import { PhotoOverlay } from './photo-overlay'

/** Static id→photo lookup, hoisted so zoom/preload don't do O(N) scans on every render. */
const PHOTO_BY_ID = new Map(photos.map((p) => [p.id, p]))

/**
 * Main container for the Photos gallery page.
 * Manages URL based category filtering, 'cover' vs 'contain' view modes and fullscreen zooming.
 *
 * Performance features:
 * - Uses `new URLSearchParams(searchParams.toString())` to safely update URL state without trailing `?`.
 * - Hoists the static `PHOTO_BY_ID` map to prevent O(N) lookups on every render when zooming.
 * - Suppresses layout morphing animations during view mode toggling via `isToggling`.
 * - Dispatches image preloading to an isolated renderer so hovering over images doesn't trigger
 *   costly root level React rerenders.
 */
export function PhotosContent() {
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const [view, setView] = useState<'cover' | 'contain'>('cover')
  const [zoomedPhotoId, setZoomedPhotoId] = useState<string | null>(null)
  const [isToggling, setIsToggling] = useState(false)
  const [preloadIds, setPreloadIds] = useState<Set<string>>(new Set())

  const preloadPhoto = useCallback((id: string) => {
    setPreloadIds((prev) => (prev.has(id) ? prev : new Set(prev).add(id)))
  }, [])

  const categoryParam = searchParams.get('category')

  const activeCategory = useMemo(() => {
    return categoryParam && PHOTO_CATEGORIES.some((c) => c.value === categoryParam)
      ? (categoryParam as Category)
      : 'all'
  }, [categoryParam])

  const handleCategoryChange = useCallback(
    (val: Category) => {
      const params = new URLSearchParams(searchParams.toString())
      if (val === 'all') {
        params.delete('category')
      } else {
        params.set('category', val)
      }

      const query = params.toString()
      const newUrl = query ? `${pathname}?${query}` : pathname

      /** Shallow URL update that syncs with `useSearchParams` without triggering a navigation. */
      window.history.replaceState(null, '', newUrl)
    },
    [searchParams, pathname],
  )

  const handleToggleView = useCallback(() => {
    setIsToggling(true)
    setView((v) => (v === 'cover' ? 'contain' : 'cover'))
    setTimeout(() => setIsToggling(false), 50)
  }, [])

  const zoomedPhoto = zoomedPhotoId ? PHOTO_BY_ID.get(zoomedPhotoId) : undefined

  const filteredPhotos = useMemo(
    () => (activeCategory === 'all' ? photos : photos.filter((p) => p.category === activeCategory)),
    [activeCategory],
  )

  return (
    <>
      <div className="z-50 mb-6 animate-page-simple md:fixed md:left-8 md:top-[calc(6rem_+_var(--banner-offset,0px))] md:mb-0 md:transition-[top] md:duration-300 md:ease-out">
        <button
          onClick={handleToggleView}
          className="relative flex h-8 shrink-0 items-center justify-center text-sm font-medium text-muted-foreground transition-colors duration-300 hover:text-primary"
          aria-label="Toggle layout mode"
          title="Toggle layout mode"
        >
          {view === 'cover' ? (
            <Icons.layoutGrid className="size-4.5" />
          ) : (
            <Icons.layoutPanel className="size-4.5" />
          )}
        </button>
      </div>

      <div className="mx-auto max-w-7xl animate-page-simple">
        <div className="mb-8">
          <CategoryFilter
            categories={PHOTO_CATEGORIES}
            value={activeCategory}
            onChange={handleCategoryChange}
          />
        </div>
        {filteredPhotos.length > 0 ? (
          <div
            key="photo-grid"
            className="columns-1 gap-4 space-y-4 sm:columns-2 lg:columns-3 xl:columns-4"
          >
            {filteredPhotos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                view={view}
                isToggling={isToggling}
                onZoom={setZoomedPhotoId}
                onPreload={preloadPhoto}
              />
            ))}
          </div>
        ) : (
          <EmptyState key="no-photos" message="no photos found in this category." />
        )}
      </div>

      <PreloadRenderer ids={preloadIds} />

      <PhotoOverlay
        photo={zoomedPhoto ?? null}
        isOpen={!!zoomedPhotoId}
        onClose={() => setZoomedPhotoId(null)}
      />
    </>
  )
}

/**
 * Individual photo item within the gallery grid.
 *
 * @param view - 'cover' forces a square aspect ratio. 'contain' uses the native image ratio.
 * @param isToggling - If true, temporarily overrides the `layout` transition to `duration: 0`
 *                     to instantly snap the image to its new grid shape without a morph animation.
 *                     This keeps the zoom animation smooth while making grid changes instantaneous.
 * @param onZoom - Dispatches the ID to open the `PhotoOverlay`.
 * @param onPreload - Registers the ID in the `PreloadRenderer` on pointer enter/down.
 */
const PhotoCard = memo(function PhotoCard({
  photo,
  view,
  isToggling,
  onZoom,
  onPreload,
}: {
  photo: Photo
  view: 'cover' | 'contain'
  isToggling: boolean
  onZoom: (id: string) => void
  onPreload: (id: string) => void
}) {
  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={ZOOM_EASE}
      className="break-inside-avoid"
    >
      <div
        onClick={() => onZoom(photo.id)}
        onPointerEnter={() => onPreload(photo.id)}
        onPointerDown={() => onPreload(photo.id)}
        style={view === 'contain' ? { aspectRatio: `${photo.width} / ${photo.height}` } : undefined}
        className={cn(
          'group relative w-full cursor-zoom-in overflow-hidden bg-muted/20',
          view === 'cover' && 'aspect-square',
        )}
      >
        <div className="absolute inset-0 z-10 bg-muted/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <m.div
          layoutId={`photo-${photo.id}`}
          transition={isToggling ? { duration: 0 } : ZOOM_EASE}
          className="relative size-full overflow-hidden"
        >
          <Image
            src={photo.url}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="size-full object-cover"
          />
        </m.div>
      </div>
    </m.div>
  )
})

/**
 * An invisible component that forces the browser to begin downloading high res images
 * before the user actually clicks on them. Rendered in a separate isolated component tree
 * to prevent the main `PhotosContent` from rerendering whenever a new ID is added.
 *
 * @param ids - Set of photo IDs that the user has hovered over.
 */
const PreloadRenderer = memo(function PreloadRenderer({ ids }: { ids: Set<string> }) {
  if (ids.size === 0) return null

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed -left-px -top-px h-px w-px overflow-hidden opacity-0"
    >
      {Array.from(ids).map((id) => {
        const p = PHOTO_BY_ID.get(id)
        if (!p) return null
        return (
          <Image
            key={`preload-${p.id}`}
            src={p.url}
            alt=""
            width={p.width}
            height={p.height}
            loading="eager"
            decoding="async"
          />
        )
      })}
    </div>
  )
})
