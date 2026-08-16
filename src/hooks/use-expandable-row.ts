'use client'

import { useState } from 'react'
import { useSoundEffects } from '@/hooks/use-sound-effects'

/** Open or shut for one row of a list, with the sound the toggle makes */
export function useExpandableRow(defaultExpanded = false) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const { toggle } = useSoundEffects()

  /**
   * No useCollapseScroll here on purpose: ExpandableContent shrinks a frame at a time through
   * CSS, so the browser keeps the window inside range on its own.
   */
  const handleToggle = () => {
    toggle(!isExpanded)
    setIsExpanded((prev) => !prev)
  }

  return { isExpanded, handleToggle }
}
