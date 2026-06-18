'use client'

import { type PointerEvent, useCallback, useRef } from 'react'
import { VolumeIcon, type VolumeIconHandle } from '@/components/ui/icons'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { commonContent } from '@/data/content/layout-content'
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcut'
import { useSoundLazy } from '@/hooks/use-sound'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import { canUseHoverPointer } from '@/utils/pointer'
import { cn } from '@/utils/utils'

interface PronounceMyNameProps {
  className?: string
  namePronunciationUrl: string
}

export function PronounceMyName({ className, namePronunciationUrl }: PronounceMyNameProps) {
  const { play, preload } = useSoundLazy(namePronunciationUrl)
  const { hoverTick } = useSoundEffects()
  const volumeIconRef = useRef<VolumeIconHandle>(null)

  const handlePointerEnter = useCallback(
    (event: PointerEvent<HTMLButtonElement>) => {
      if (canUseHoverPointer(event.pointerType)) hoverTick()
      preload()
    },
    [hoverTick, preload],
  )

  const handlePlayClick = useCallback(() => {
    volumeIconRef.current?.startAnimation()
    play(1, true)
  }, [play])

  useKeyboardShortcut('P', handlePlayClick)

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onPointerEnter={handlePointerEnter}
          onClick={handlePlayClick}
          aria-label={commonContent.pronounceName}
          className={cn(
            'relative select-none text-secondary transition-[color,scale] duration-300 after:absolute after:-inset-1 supports-hover:hover:text-primary active:text-primary active:scale-[0.95] active:duration-200',
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
