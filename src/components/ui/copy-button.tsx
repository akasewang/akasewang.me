'use client'

import { AnimatePresence, type HTMLMotionProps, m } from 'framer-motion'
import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { Icons } from '@/components/ui/icons'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import { cn } from '@/utils/utils'

interface CopyButtonProps extends HTMLMotionProps<'button'> {
  value: string
  iconSize?: number
  copied?: boolean
}

/** Copies its value and briefly swaps to a tick, so the click is acknowledged */
export function CopyButton({
  value,
  iconSize = 14,
  className,
  onClick,
  copied: controlledCopied,
  ...props
}: CopyButtonProps) {
  const { success, error, hoverTick } = useSoundEffects()
  const [internalCopied, setInternalCopied] = useState(false)
  const isCopied = controlledCopied ?? internalCopied
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current)
    }
  }, [])

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e)
    if (e.defaultPrevented || controlledCopied !== undefined) return

    try {
      await navigator.clipboard.writeText(value)
      success()
      setInternalCopied(true)

      if (resetTimerRef.current) clearTimeout(resetTimerRef.current)
      resetTimerRef.current = setTimeout(() => setInternalCopied(false), 1500)
    } catch (err) {
      error()
      console.error(err)
    }
  }

  const ActiveIcon = isCopied ? Icons.check : Icons.copy

  return (
    <m.button
      type="button"
      onClick={handleCopy}
      onMouseEnter={(e) => {
        hoverTick()
        props.onMouseEnter?.(e)
      }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      aria-label={isCopied ? 'Copied to clipboard' : 'Copy to clipboard'}
      data-copied={isCopied}
      className={cn(
        'group/copy inline-flex items-center justify-center',
        isCopied ? 'text-primary' : 'supports-hover:hover:text-primary active:text-primary',
        className,
      )}
      {...props}
    >
      <span className="relative" style={{ width: iconSize, height: iconSize }}>
        <AnimatePresence initial={false} mode="popLayout">
          <m.span
            key={isCopied ? 'check' : 'copy'}
            initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0, rotate: 45 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <ActiveIcon size={iconSize} weight={isCopied ? 'regular' : 'duotone'} />
          </m.span>
        </AnimatePresence>
      </span>
    </m.button>
  )
}
