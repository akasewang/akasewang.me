import { useRouter } from 'next/navigation'
import { useEffect, useEffectEvent } from 'react'

interface ShortcutOptions {
  ctrlKey?: boolean
  metaKey?: boolean
  altKey?: boolean
  shiftKey?: boolean
  preventDefault?: boolean
}

/**
 * Binds a document wide shortcut to either a route to push or a callback. Modifiers must match
 * exactly, so a plain key never fires while a combination is held.
 */
export function useKeyboardShortcut(
  key: string,
  action: string | (() => void),
  {
    ctrlKey = false,
    metaKey = false,
    altKey = false,
    shiftKey = false,
    preventDefault = true,
  }: ShortcutOptions = {},
) {
  const router = useRouter()
  const runAction = useEffectEvent(() => {
    if (typeof action === 'string') {
      router.push(action, { scroll: false })
    } else {
      action()
    }
  })

  useEffect(() => {
    const targetKey = key.toLowerCase()

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement

      /** Someone typing owns the keystroke, however the shortcut is configured */
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable) {
        return
      }

      if (
        e.key.toLowerCase() === targetKey &&
        e.ctrlKey === ctrlKey &&
        e.metaKey === metaKey &&
        e.altKey === altKey &&
        e.shiftKey === shiftKey
      ) {
        if (preventDefault) {
          e.preventDefault()
        }

        runAction()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [key, ctrlKey, metaKey, altKey, shiftKey, preventDefault])
}
