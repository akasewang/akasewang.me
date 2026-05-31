'use client'

import Link from 'next/link'
import { ViewCounter } from '@/components/common/view-counter'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { footerContent } from '@/data/content/layout-content'

const { license, licenseHref, ownerName } = footerContent
const currentYear = new Date().getFullYear()

/**
 * Global site footer.
 * Displays licensing, copyright, and global site visitor metrics.
 */
export function Footer() {
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
                      className="transition-colors duration-300 hover:text-foreground"
                    >
                      {license}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="top">View License</TooltipContent>
                </Tooltip>
              ) : (
                license
              )}
            </span>
          )}
          &copy; {currentYear} {ownerName}
        </p>

        <div className="text-sm tracking-wide text-muted-foreground/50">
          {/* Use the 'visitors' type to aggregate unique IP visits across the entire domain, rather than total page views */}
          <ViewCounter type="visitors" />
        </div>
      </div>
    </footer>
  )
}
