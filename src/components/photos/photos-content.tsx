'use client'

import { m } from 'framer-motion'
import Image from 'next/image'
import { usePathname, useSearchParams } from 'next/navigation'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CategoryFilter } from '@/components/common/category-filter'
import { EmptyState } from '@/components/common/empty-state'
import { Icons } from '@/components/ui/icons'
import { PHOTO_CATEGORIES } from '@/constants/categories'
import { ZOOM_EASE } from '@/constants/ui'
import { photos } from '@/data/static/photos'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import type { Category, Photo } from '@/types/photos'
import { cn } from '@/utils/utils'
import { PhotoOverlay } from './photo-overlay'

const PHOTO_BY_ID = new Map(photos.map((p) => [p.id, p]))

export function PhotosContent() {
  const { toggle, hoverTick } = useSoundEffects()
  const searchParams = useSearchParams()
  const pathname = usePathname()

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

      window.history.replaceState(null, '', newUrl)
    },
    [searchParams, pathname],
  )

  const handleToggleView = useCallback(() => {
    const nextView = view === 'cover' ? 'contain' : 'cover'

    toggle(nextView === 'contain')
    setIsToggling(true)
    setView(nextView)

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
      <div className="z-50 mb-6 animate-page-simple md:fixed md:left-8 md:top-24 md:mb-0">
        <button
          type="button"
          onClick={handleToggleView}
          onMouseEnter={hoverTick}
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
            className="columns-1 gap-2 space-y-2 sm:columns-2 sm:gap-2.5 sm:space-y-2.5 lg:columns-3 xl:columns-4"
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
  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={ZOOM_EASE}
      className="break-inside-avoid"
    >
      <button
        type="button"
        onClick={() => {
          zoom(true)
          onZoom(photo.id)
        }}
        onPointerEnter={() => {
          hoverCard()
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
