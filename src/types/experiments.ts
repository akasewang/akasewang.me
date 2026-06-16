import type { ComponentType } from 'react'

export interface Experiment {
  id: string
  name: string
  Component: ComponentType
}
