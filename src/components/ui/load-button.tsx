'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/utils/utils'

interface LoadButtonProps {
  onLoad: () => void
  isLoading?: boolean
  label: string
  loadingLabel: string
  className?: string
}

/**
 * Asks for the next page of something, where a list is not free to load it on scroll.
 *
 * Built on the shared button rather than styled beside it, so the two cannot drift: this is that
 * button with the states a load has, which are only resting and working. There is nothing to
 * confirm, so no success state, and nothing to wait out, so no countdown.
 *
 * Smaller than the button it is built on, and carrying no icon. Asking for more of what is already
 * on screen is the quietest thing on the page, and it sits under content rather than closing a form,
 * so it takes only the room the words need.
 *
 * Whether a list needs this at all is the list's decision. One filling its own page has nothing
 * below it and can load as the reader arrives; one sitting inside a page has to be asked, or it
 * grows as fast as the reader moves and the end of the page is never reached.
 */
export function LoadButton({
  onLoad,
  isLoading = false,
  label,
  loadingLabel,
  className,
}: LoadButtonProps) {
  return (
    <Button
      type="button"
      onClick={onLoad}
      isPending={isLoading}
      defaultText={label}
      loadingText={loadingLabel}
      className={cn('min-h-0 w-auto rounded-md px-4 py-1 text-xs leading-5', className)}
    />
  )
}
