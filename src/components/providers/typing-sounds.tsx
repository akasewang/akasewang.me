'use client'

import { useEffect } from 'react'
import { type KeyKind, useSoundEffects } from '@/hooks/use-sound-effects'

/** Fields whose keystrokes are audible. A password field is deliberately not among them */
const AUDIBLE_INPUT_TYPES = ['text', 'search', 'email', 'url', 'tel', 'number']

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false

  if (target.isContentEditable) return true

  const name = target.tagName

  if (name === 'INPUT') return AUDIBLE_INPUT_TYPES.includes((target as HTMLInputElement).type)

  return name === 'TEXTAREA'
}

/** Sorts a key into the sound it makes, or into nothing for the ones that should be silent */
function keyKindOf(key: unknown): KeyKind | null {
  /** Autofill and browser integrations can dispatch keydown-shaped events without a key value. */
  if (typeof key !== 'string' || key.length === 0) return null

  if (key === ' ' || key === 'Spacebar') return 'space'
  if (key === 'Enter') return 'enter'
  if (key === 'Backspace' || key === 'Delete') return 'delete'
  if (key === 'Tab' || key === 'Escape') return 'modifier'
  if (key.startsWith('Arrow') || key === 'Home' || key === 'End') return 'modifier'

  return key.length === 1 ? 'letter' : null
}

/** Plays a keystroke sound as text is typed anywhere on the site, when sound is on */
export function TypingSounds() {
  const { typeKey } = useSoundEffects()

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      /** A shortcut is not typing, however much it looks like it from here */
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (!isTypingTarget(event.target)) return

      const kind = keyKindOf(event.key)
      if (kind === null) return

      typeKey(kind, event.key, event.repeat)
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [typeKey])

  return null
}
