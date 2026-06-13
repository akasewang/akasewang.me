'use client'

import { AnimatePresence, m } from 'framer-motion'
import { useState } from 'react'
import { Icons } from '@/components/ui/icons'
import { InfiniteCarousel } from '@/components/ui/infinite-carousel'
import { announcementBanner } from '@/data/content/layout-content'
import { useSoundEffects } from '@/hooks/use-sound-effects'

/**
 * Dismissible Announcement Banner.
 * A fixed, full width bar pinned to the top of the screen featuring a seamlessly
 * looping text carousel and a grain overlay. Links out to external content and
 * can be temporarily closed via the trailing icon.
 *
 * Drives the global `--banner-offset` CSS variable so the navbar and page content
 * shift down while the banner is visible. The variable defaults to the banner height
 * in globals.css, so the space is reserved from first paint with no layout shift and no
 * inline script, and is set to 0 here when the banner is dismissed.
 */
export function AnnouncementBanner() {
  const { tap, clickPop, hoverLink, hoverTick } = useSoundEffects()
  const [visible, setVisible] = useState(true)

  const dismiss = () => {
    tap()
    setVisible(false)
    document.documentElement.style.setProperty('--banner-offset', '0px')
  }

  return (
    <AnimatePresence>
      {visible && (
        <m.aside
          initial={false}
          animate={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="bg-gradient-to-r from-verified to-verified-deep fixed inset-x-0 top-0 z-[60] flex h-10 items-center justify-center overflow-hidden border-b border-white/10 px-12 shadow-md"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-[shimmer_5s_linear_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"
          />

          <a
            href={announcementBanner.href}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={hoverLink}
            onClick={clickPop}
            className="group relative z-10 flex w-full max-w-[calc(100%-3rem)] overflow-hidden text-sm font-medium text-white/70 transition-colors hover:text-white [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]"
          >
            <InfiniteCarousel
              items={[announcementBanner.message]}
              loopMultiplier={12}
              speed={0.8}
              renderItem={(msg) => (
                <span className="flex items-center gap-4 whitespace-nowrap pl-4">
                  {msg}
                  <span className="text-white/30">&bull;</span>
                </span>
              )}
              className="w-full"
            />
          </a>

          <button
            type="button"
            onClick={dismiss}
            onMouseEnter={hoverTick}
            aria-label={announcementBanner.dismissLabel}
            className="absolute right-3 top-1/2 z-10 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-white/70 transition-colors duration-300 hover:bg-white/10 hover:text-white"
          >
            <Icons.close className="size-4.5" />
          </button>
        </m.aside>
      )}
    </AnimatePresence>
  )
}
