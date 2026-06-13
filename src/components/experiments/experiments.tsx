import type { Experiment } from '@/types/experiments'
import { MagneticGrid } from './demos/magnetic-grid'
import { Orb } from './demos/orb'
import { PaintStrokes } from './demos/paint-strokes'
import { WaveLines } from './demos/wave-lines'

/**
 * Experiments registry.
 * Each entry pairs a live interactive component with the grid footprint it occupies. Spans are
 * authored so the set tiles cleanly into a dense 4 column bento on desktop and a 2 column stack on
 * mobile, and the order drives that dense packing. Reorder or drop in new sketches here and the grid
 * reflows around them.
 */
export const experiments: Experiment[] = [
  {
    id: 'paint-strokes',
    name: 'Wet Paint',
    className: 'col-span-2 row-span-2',
    Component: PaintStrokes,
  },
  { id: 'wave-lines', name: 'Contours', className: 'col-span-2 row-span-1', Component: WaveLines },
  {
    id: 'magnetic-grid',
    name: 'Magnetic Grid',
    className: 'col-span-1 row-span-1',
    Component: MagneticGrid,
  },
  { id: 'orb', name: 'Orb', className: 'col-span-1 row-span-1', Component: Orb },
]
