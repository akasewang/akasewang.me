'use client'

import { AnimatePresence, m } from 'framer-motion'
import Image from 'next/image'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CategoryFilter } from '@/components/common/category-filter'
import { EmptyState } from '@/components/common/empty-state'
import { PHOTOS_GRID_CLASS, PHOTOS_RAIL_CLASS } from '@/components/skeletons/photos'
import { Icons } from '@/components/ui/icons'
import { PHOTO_CATEGORIES } from '@/constants/categories'
import { ZOOM_EASE } from '@/constants/ui'
import { photos } from '@/data/static/photos'
import { useCategoryParam } from '@/hooks/use-category-param'
import { useArrivedWithPage, usePageArriving } from '@/hooks/use-page-arrival'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import type { Photo } from '@/types/photos'
import { canUseHoverPointer } from '@/utils/pointer'
import { cn } from '@/utils/utils'
import { PhotoOverlay } from './photo-overlay'

const PHOTO_BY_ID = new Map(photos.map((p) => [p.id, p]))

/**
 * The photos page: the grid, its filter and the overlay a photo opens into.
 *
 * Inspired by Anthony Fu's photos page, full width and opening into the picture rather than a
 * gallery. The filter, the cover and contain toggle and the zoom overlay are this site's own.
 *
 * Anthony Fu: https://antfu.me/photos
 * Source: https://github.com/antfu/antfu.me
 */
export function PhotosContent() {
  const { toggle, hoverTick } = useSoundEffects()
  const [activeCategory, handleCategoryChange] = useCategoryParam(PHOTO_CATEGORIES)
  const isArriving = usePageArriving()

  const [view, setView] = useState<'cover' | 'contain'>('cover')
  const [zoomedPhotoId, setZoomedPhotoId] = useState<string | null>(null)
  const [isToggling, setIsToggling] = useState(false)
  const [preloadIds, setPreloadIds] = useState<Set<string>>(new Set())
  const toggleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (toggleTimerRef.current) clearTimeout(toggleTimerRef.current)
    }
  }, [])

  /** Full size versions are only fetched for photos that have been hovered or opened */
  const preloadPhoto = useCallback((id: string) => {
    setPreloadIds((prev) => (prev.has(id) ? prev : new Set(prev).add(id)))
  }, [])

  const handleToggleView = useCallback(() => {
    const nextView = view === 'cover' ? 'contain' : 'cover'

    toggle(nextView === 'contain')
    setIsToggling(true)
    setView(nextView)

    /**
     * A frame or two with layout animation suppressed. Cropped and uncropped are different shapes,
     * and animating between them would slide every photo in the grid rather than swap the fit.
     */
    if (toggleTimerRef.current) clearTimeout(toggleTimerRef.current)
    toggleTimerRef.current = setTimeout(() => setIsToggling(false), 50)
  }, [toggle, view])

  const zoomedPhoto = zoomedPhotoId ? PHOTO_BY_ID.get(zoomedPhotoId) : undefined

  const filteredPhotos = useMemo(
    () => (activeCategory === 'all' ? photos : photos.filter((p) => p.category === activeCategory)),
    [activeCategory],
  )

  return (
    <>
      <div className={PHOTOS_RAIL_CLASS}>
        <button
          type="button"
          onClick={handleToggleView}
          onMouseEnter={hoverTick}
          className="relative flex h-8 shrink-0 items-center justify-center text-sm font-medium text-muted-foreground transition-[color,transform,scale] duration-300 supports-hover:hover:text-primary active:text-primary active:scale-[0.95] active:duration-200 md:sticky md:top-24"
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

      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <CategoryFilter
            categories={PHOTO_CATEGORIES}
            value={activeCategory}
            onChange={handleCategoryChange}
          />
        </div>
        <AnimatePresence mode="popLayout">
          {filteredPhotos.length > 0 ? (
            <m.div
              key="photo-grid"
              layout={!isArriving ? 'position' : false}
              className={PHOTOS_GRID_CLASS}
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
            </m.div>
          ) : (
            <EmptyState key="no-photos" message="no photos found in this category." />
          )}
        </AnimatePresence>
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
  const { hoverCard, zoom } = useSoundEffects()
  const arrivedWithPage = useArrivedWithPage()
  const isArriving = usePageArriving()

  return (
    <m.div
      layout={!isArriving && !isToggling}
      initial={arrivedWithPage ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={ZOOM_EASE}
      className="w-full"
    >
      <button
        type="button"
        onClick={() => {
          zoom(true)
          onZoom(photo.id)
        }}
        onPointerEnter={(event) => {
          if (canUseHoverPointer(event.pointerType)) hoverCard()
          onPreload(photo.id)
        }}
        onPointerDown={() => onPreload(photo.id)}
        style={view === 'contain' ? { aspectRatio: `${photo.width} / ${photo.height}` } : undefined}
        className={cn(
          'group relative w-full cursor-zoom-in overflow-hidden bg-surface-20',
          view === 'cover' && 'aspect-square',
          'block border-0 p-0 text-left',
        )}
      >
        <div className="absolute inset-0 z-10 bg-muted/10 opacity-0 transition-opacity duration-300 supports-hover:group-hover:opacity-100 group-active:opacity-100" />

        <m.div
          layoutId={`photo-${photo.id}`}
          transition={isToggling || isArriving ? { duration: 0 } : ZOOM_EASE}
          className="relative size-full overflow-hidden"
        >
          <Image
            src={photo.url}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="size-full object-cover"
          />
        </m.div>
      </button>
    </m.div>
  )
})

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
