import type { Experiment } from '@/types/experiments'
import { AsciiTorus } from './demos/ascii-torus'
import { MagneticGrid } from './demos/magnetic-grid'
import { Orb } from './demos/orb'
import { PaintStrokes } from './demos/paint-strokes'
import { WaveLines } from './demos/wave-lines'

export const experiments: Experiment[] = [
  {
    id: 'ascii-torus',
    name: 'Donut',
    Component: AsciiTorus,
    span: 'col-span-2 row-span-2 md:col-span-4 md:row-span-3',
  },
  {
    id: 'orb',
    name: 'Orb',
    Component: Orb,
    span: 'col-span-1 row-span-2 md:col-span-2',
  },
  {
    id: 'magnetic-grid',
    name: 'Magnetic Grid',
    Component: MagneticGrid,
    span: 'col-span-1 row-span-2 md:col-span-2 md:row-span-1',
  },
  {
    id: 'paint-strokes',
    name: 'Wet Paint',
    Component: PaintStrokes,
    span: 'col-span-1 row-span-2 md:col-span-2',
  },
  {
    id: 'wave-lines',
    name: 'Contours',
    Component: WaveLines,
    span: 'col-span-1 row-span-2 md:col-span-4',
  },
]
