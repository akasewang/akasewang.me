'use client'

import { useState } from 'react'
import { useSoundEffects } from '@/hooks/use-sound-effects'

const isNestedInteractiveTarget = (e: React.SyntheticEvent<HTMLElement>) =>
  e.target instanceof Element &&
  e.target !== e.currentTarget &&
  e.target.closest('a, button, input, select, textarea, [role="button"]') !== e.currentTarget

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
