import type { Experiment } from '@/types/experiments'
import { MagneticGrid } from './demos/magnetic-grid'
import { Orb } from './demos/orb'
import { PaintStrokes } from './demos/paint-strokes'
import { WaveLines } from './demos/wave-lines'

export const experiments: Experiment[] = [
  {
    id: 'paint-strokes',
    name: 'Wet Paint',
    Component: PaintStrokes,
  },
  {
    id: 'wave-lines',
    name: 'Contours',
    Component: WaveLines,
  },
  {
    id: 'magnetic-grid',
    name: 'Magnetic Grid',
    Component: MagneticGrid,
  },
  {
    id: 'orb',
    name: 'Orb',
    Component: Orb,
  },
]
