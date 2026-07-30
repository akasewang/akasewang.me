'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ViewCounter } from '@/components/common/view-counter'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { footerContent } from '@/data/content/layout-content'
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcut'
import { useSoundEffects } from '@/hooks/use-sound-effects'

const { license, licenseHref, ownerName, changelogLabel, changelogHref } = footerContent

export function Footer() {
  const currentYear = new Date().getFullYear()
  const { hoverLink, navigate: navigateSound } = useSoundEffects()
  useKeyboardShortcut(
    'l',
    () => {
      if (licenseHref) {
        navigateSound()
        window.open(licenseHref, '_blank', 'noopener,noreferrer')
      }
    },
    { shiftKey: true },
  )

  const router = useRouter()
  useKeyboardShortcut('l', () => {
    if (changelogHref) {
      navigateSound()
      router.push(changelogHref)
    }
  })

  return (
    <footer className="py-6">
      <div className="mx-auto flex max-w-[800px] flex-col items-center justify-between gap-2 px-8 sm:flex-row text-sm text-muted-foreground/50">
        <div className="flex items-center gap-1.5">
          {license &&
            (licenseHref ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={licenseHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={hoverLink}
                    onClick={navigateSound}
                    className="transition-colors duration-300 supports-hover:hover:text-foreground active:text-foreground"
                  >
                    {license}
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="top" shortcut={['Shift', 'L']}>
                  View License
                </TooltipContent>
              </Tooltip>
            ) : (
              <span>{license}</span>
            ))}
          <span>
            &copy; {currentYear} {ownerName}
          </span>
        </div>

        <div className="flex items-center gap-3 tracking-wide">
          <ViewCounter type="sessions" />

          {changelogLabel && changelogHref && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={changelogHref}
                  onMouseEnter={hoverLink}
                  onClick={navigateSound}
                  className="transition-colors duration-300 supports-hover:hover:text-foreground active:text-foreground font-mono"
                >
                  {changelogLabel}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="top" shortcut="L">
                View Changelog
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </footer>
  )
}
