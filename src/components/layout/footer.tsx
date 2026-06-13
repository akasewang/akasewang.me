'use client'

import Link from 'next/link'
import { ViewCounter } from '@/components/common/view-counter'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { footerContent } from '@/data/content/layout-content'
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcut'
import { useSoundEffects } from '@/hooks/use-sound-effects'

const { license, licenseHref, ownerName, changelogLabel, changelogHref } = footerContent
const currentYear = new Date().getFullYear()

/**
 * Global site footer.
 * Displays licensing, copyright and global site visitor metrics.
 */
export function Footer() {
  const { hoverLink, navigate: navigateSound } = useSoundEffects()
  useKeyboardShortcut('l', () => {
    if (licenseHref) {
      navigateSound()
      window.open(licenseHref, '_blank', 'noopener,noreferrer')
    }
  })

  return (
    <footer className="py-6">
      <div className="mx-auto flex max-w-[800px] flex-col items-center justify-between gap-2 px-8 sm:flex-row">
        <p className="text-sm text-muted-foreground/50">
          {license && (
            <span className="mr-1">
              {licenseHref ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={licenseHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      onMouseEnter={hoverLink}
                      onClick={navigateSound}
                      className="transition-colors duration-300 hover:text-foreground"
                    >
                      {license}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="top" shortcut="L">
                    View License
                  </TooltipContent>
                </Tooltip>
              ) : (
                license
              )}
            </span>
          )}
          &copy; {currentYear} {ownerName}
        </p>

        <div className="flex items-center gap-3 text-sm tracking-wide text-muted-foreground/50">
          {changelogLabel && changelogHref && (
            <Link
              href={changelogHref}
              onMouseEnter={hoverLink}
              onClick={navigateSound}
              className="transition-colors duration-300 hover:text-foreground"
            >
              {changelogLabel}
            </Link>
          )}

          {/** Use visitor counting to aggregate unique IP visits across the entire domain rather than total page views. */}
          <ViewCounter type="visitors" />
        </div>
      </div>
    </footer>
  )
}
