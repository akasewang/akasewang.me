'use client'

import { useCallback, useRef } from 'react'

export function usePopupToggleSound(toggle: (open: boolean) => void) {
  const skipNextCloseSoundRef = useRef(false)

  const markSelectionClose = useCallback(() => {
    skipNextCloseSoundRef.current = true
  }, [])

  const playOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        toggle(true)
      } else if (skipNextCloseSoundRef.current) {
        skipNextCloseSoundRef.current = false
      } else {
        toggle(false)
      }
    },
    [toggle],
  )

  return { markSelectionClose, playOpenChange }
}
