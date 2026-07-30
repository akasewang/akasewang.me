import type { ComponentType } from 'react'

export interface Experiment {
  id: string
  name: string
  Component: ComponentType
  /** Grid footprint. Order matters, since the tiles pack in the order they are declared */
  span: string
}
