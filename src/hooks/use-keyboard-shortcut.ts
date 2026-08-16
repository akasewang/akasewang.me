import { useRouter } from 'next/navigation'
import { useEffect, useEffectEvent } from 'react'

interface ShortcutOptions {
  ctrlKey?: boolean
  metaKey?: boolean
  /** Accept either Control or Command, but not both at once. */
  ctrlOrMetaKey?: boolean
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
    ctrlOrMetaKey = false,
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
      /** One physical press is one command, and already-claimed or composing input is left alone. */
      if (e.defaultPrevented || e.repeat || e.isComposing) return

      const target = e.target as HTMLElement

      /** Someone typing owns the keystroke, however the shortcut is configured */
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable) {
        return
      }

      const primaryModifierMatches = ctrlOrMetaKey
        ? e.ctrlKey !== e.metaKey
        : e.ctrlKey === ctrlKey && e.metaKey === metaKey

      if (
        e.key.toLowerCase() === targetKey &&
        primaryModifierMatches &&
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
  }, [key, ctrlKey, metaKey, ctrlOrMetaKey, altKey, shiftKey, preventDefault])
}
