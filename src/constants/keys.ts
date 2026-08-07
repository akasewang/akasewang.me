/** A key as it is shown and as it is read out: the glyph is drawn, the name labels it for screen readers */
export interface KeyCap {
  glyph: string
  name: string
}

/**
 * Every key the interface shows in a shortcut hint, listed once so the hint and the key it names
 * stay in step.
 *
 * Command and control are both listed because the right one depends on the reader's platform.
 * usePlatformModifier picks between them.
 */
export const KEY_CAPS = {
  command: { glyph: '⌘', name: 'Command' },
  control: { glyph: 'ctrl', name: 'Control' },
  option: { glyph: '⌥', name: 'Option' },
  shift: { glyph: '⇧', name: 'Shift' },
  enter: { glyph: '↵', name: 'Enter' },
  escape: { glyph: 'esc', name: 'Escape' },
  arrowUp: { glyph: '↑', name: 'Arrow up' },
  arrowDown: { glyph: '↓', name: 'Arrow down' },
  k: { glyph: 'K', name: 'K' },
} as const satisfies Record<string, KeyCap>
