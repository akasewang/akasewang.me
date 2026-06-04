'use client'

import React, { useState } from 'react'
import { m, AnimatePresence, type HTMLMotionProps } from 'framer-motion'
import { Icons } from '@/components/ui/icons'
import { cn } from '@/utils/utils'

/** Props for {@link CopyButton}. */
interface CopyButtonProps extends HTMLMotionProps<'button'> {
  value: string
  iconSize?: number
  copied?: boolean
}

/**
 * A button that copies `value` to the clipboard, swapping the copy icon for a check on success.
 * Works uncontrolled (manages its own brief "copied" state) or controlled (via the `copied` prop).
 *
 * @param value - The text string to copy to the clipboard.
 * @param iconSize - The pixel size of the rendered icon.
 * @param copied - If provided, the button acts as a controlled component reacting to this external state.
 */
export function CopyButton({
  value,
  iconSize = 14,
  className,
  onClick,
  copied: controlledCopied,
  ...props
}: CopyButtonProps) {
  const [internalCopied, setInternalCopied] = useState(false)
  const isCopied = controlledCopied ?? internalCopied

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e as any)
    if (controlledCopied !== undefined) return

    try {
      await navigator.clipboard.writeText(value)
      setInternalCopied(true)
      setTimeout(() => setInternalCopied(false), 1500)
    } catch (err) {
      console.error(err)
    }
  }

  const ActiveIcon = (isCopied ? Icons.check : Icons.copy) as React.ElementType

  return (
    <m.button
      type="button"
      onClick={handleCopy}
      whileTap={{ scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      aria-label={isCopied ? 'Copied to clipboard' : 'Copy to clipboard'}
      data-copied={isCopied}
      className={cn(
        'group/copy inline-flex items-center justify-center',
        isCopied ? 'text-primary' : 'hover:text-primary',
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
            <ActiveIcon size={iconSize} />
          </m.span>
        </AnimatePresence>
      </span>
    </m.button>
  )
}
