'use client'

import { useState } from 'react'
import { useSoundEffects } from '@/hooks/use-sound-effects'

/**
 * Detects events originating from interactive descendants (links, buttons, inputs)
 * so a click-to-expand card does not toggle when a nested control is activated.
 */
const isNestedInteractiveTarget = (e: React.SyntheticEvent<HTMLElement>) =>
  e.target instanceof Element &&
  e.target !== e.currentTarget &&
  e.target.closest('a, button, input, select, textarea, [role="button"]') !== e.currentTarget

/**
 * Shared behavior for click-to-expand rows (timeline items, changelog commits).
 * Owns the expanded state, the toggle sound effect, and the click/keyboard handlers
 * including the nested interactive guard, so the accessibility contract lives in
 * one place. Consumers spread the handlers onto a `role="button"` element.
 *
 * @param defaultExpanded - Whether the row starts expanded.
 */
export function useExpandableRow(defaultExpanded = false) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const { toggle } = useSoundEffects()

  const handleToggle = () => {
    toggle(!isExpanded)
    setIsExpanded((prev) => !prev)
  }

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (isNestedInteractiveTarget(e)) return
    handleToggle()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (isNestedInteractiveTarget(e)) return

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleToggle()
    }
  }

  return { isExpanded, handleClick, handleKeyDown }
}
