import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface ShortcutOptions {
  ctrlKey?: boolean
  metaKey?: boolean
  altKey?: boolean
  shiftKey?: boolean
  preventDefault?: boolean
}

/** Binds global keyboard shortcuts to actions or routes, ignoring inputs in form elements. */
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
  const actionRef = useRef(action)

  useEffect(() => {
    /**
     * Storing the action in a ref ensures the keydown listener always executes the most
     * current version of the callback or route string, avoiding stale closures while
     * preventing the `useEffect` from unnecessarily re-attaching the listener on every render.
     */
    actionRef.current = action
  }, [action])

  useEffect(() => {
    const targetKey = key.toLowerCase()

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement

      /** Silently ignore keyboard shortcuts if the user is typing inside an input, textarea, or content-editable field */
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

        const currentAction = actionRef.current
        if (typeof currentAction === 'string') {
          router.push(currentAction)
        } else {
          currentAction()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [key, ctrlKey, metaKey, altKey, shiftKey, preventDefault, router])
}
