import type { ComponentType } from 'react'

/** A single interactive experiment rendered as a live tile in the bento grid. */
export interface Experiment {
  /** Stable unique identifier, used as a React key. */
  id: string
  /** Short name surfaced only as a faint hover hint and the tile's accessible label. */
  name: string
  /** Tailwind grid span classes that decide the tile footprint within the bento grid. */
  className: string
  /** The live interactive component rendered to fill the tile. */
  Component: ComponentType
}
