'use client'

import { useRef, useCallback } from 'react'
import { VolumeIcon, type VolumeIconHandle } from '@/components/ui/icons'
import { useSoundLazy } from '@/hooks/use-sound'
import { trackEvent } from '@/lib/events'
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcut'
import { cn } from '@/utils/utils'
import { commonContent } from '@/data/content/layout-content'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

/** Props for {@link PronounceMyName}. */
interface PronounceMyNameProps {
  className?: string
  namePronunciationUrl: string
}

/**
 * A button (and `P` keyboard shortcut) that plays a name-pronunciation audio clip and
 * animates the speaker icon while it plays. Preloads the audio on hover.
 *
 * @param className - Optional CSS classes for custom container styling.
 * @param namePronunciationUrl - The URL path to the audio file to be played.
 */
export function PronounceMyName({ className, namePronunciationUrl }: PronounceMyNameProps) {
  const { play, preload } = useSoundLazy(namePronunciationUrl)
  const volumeIconRef = useRef<VolumeIconHandle>(null)

  const handlePlayClick = useCallback(() => {
    volumeIconRef.current?.startAnimation()
    play()
    trackEvent({ name: 'play_name_pronunciation' })
  }, [play])

  useKeyboardShortcut('P', handlePlayClick)

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onPointerEnter={preload}
          onClick={handlePlayClick}
          aria-label={commonContent.pronounceName}
          className={cn(
            'relative select-none text-secondary transition-[color,scale] duration-300 after:absolute after:-inset-1 hover:text-primary active:scale-[0.95] active:duration-200',
            className,
          )}
        >
          <VolumeIcon ref={volumeIconRef} className="size-4.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" shortcut="P">
        {commonContent.pronounceName}
      </TooltipContent>
    </Tooltip>
  )
}
