'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils/utils'
import { Icons } from '@/components/ui/icons'
import { photos } from '@/data/static/photos'
import { CategoryFilter } from '@/components/common/category-filter'
import { EmptyState } from '@/components/common/empty-state'
import { ZOOM_EASE } from '@/constants/ui'
import { PageLayout } from '@/components/layout/page-layout'
import { PHOTO_CATEGORIES } from '@/constants/categories'
import type { Category } from '@/types/photos'
import { PhotoOverlay } from './photo-overlay'

/**
 * and a dynamic layout toggle (aspect ratio vs strict square cropping).
 * Connects directly with the PhotoOverlay component for image lightboxing.
 */
export function PhotosContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [view, setView] = useState<'cover' | 'contain'>('cover')
  const [zoomedPhotoId, setZoomedPhotoId] = useState<string | null>(null)
  const [isToggling, setIsToggling] = useState(false)

  const categoryParam = searchParams.get('category')
  const activeCategory = useMemo(() => {
    return categoryParam && PHOTO_CATEGORIES.some((c) => c.value === categoryParam)
      ? (categoryParam as Category)
      : 'all'
  }, [categoryParam])

  const handleCategoryChange = (val: Category) => {
    const params = new URLSearchParams(searchParams)
    if (val === 'all') {
      params.delete('category')
    } else {
      params.set('category', val)
    }
    router.replace(`/photos?${params.toString()}`, { scroll: false })
  }

  const handleToggleView = () => {
    setIsToggling(true)
    setView((v) => (v === 'cover' ? 'contain' : 'cover'))
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsToggling(false)
      })
    })
  }

  const zoomedPhoto = useMemo(() => photos.find((p) => p.id === zoomedPhotoId), [zoomedPhotoId])

  const filteredPhotos = useMemo(
    () => (activeCategory === 'all' ? photos : photos.filter((p) => p.category === activeCategory)),
    [activeCategory],
  )

  return (
    <>
      <PageLayout
        animate={false}
        footerText="Taking photos so I don't have to remember things."
        className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] min-h-screen w-screen overflow-hidden px-8 pb-12 pt-2 md:px-28 md:pt-12"
      >
        <div className="z-50 mb-6 md:fixed md:left-8 md:top-24 md:mb-0 animate-page-simple">
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
          <AnimatePresence mode="popLayout">
            {filteredPhotos.length > 0 ? (
              <motion.div
                key="photo-grid"
                className="columns-1 gap-4 space-y-4 sm:columns-2 lg:columns-3 xl:columns-4"
              >
                {filteredPhotos.map((photo, idx) => (
                  <motion.div
                    key={photo.id ?? idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={ZOOM_EASE}
                    className="break-inside-avoid"
                  >
                    <div
                      onClick={() => setZoomedPhotoId(photo.id)}
                      style={
                        view === 'contain'
                          ? { aspectRatio: `${photo.width} / ${photo.height}` }
                          : undefined
                      }
                      className={cn(
                        'group relative w-full cursor-zoom-in overflow-hidden bg-muted/20',
                        view === 'cover' && 'aspect-square',
                      )}
                    >
                      <div className="absolute inset-0 z-10 bg-muted/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                      <motion.div
                        layoutId={`photo-${photo.id}`}
                        transition={isToggling ? { duration: 0 } : ZOOM_EASE}
                        className="relative h-full w-full overflow-hidden"
                      >
                        <Image
                          src={photo.url}
                          alt={photo.alt}
                          width={photo.width}
                          height={photo.height}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                          className={cn(
                            'h-full w-full',
                            view === 'contain' ? 'object-cover' : 'object-cover',
                          )}
                        />
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <EmptyState key="no-photos" message="no photos found in this category." />
            )}
          </AnimatePresence>
        </div>
      </PageLayout>

      <PhotoOverlay
        photo={zoomedPhoto ?? null}
        isOpen={!!zoomedPhotoId}
        onClose={() => setZoomedPhotoId(null)}
      />
    </>
  )
}
