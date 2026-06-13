'use client'

import { ExperimentTile } from './experiment-tile'
import { experiments } from './experiments'

/**
 * Bento grid of live interactive experiments.
 *
 * Lays the tiles out on a dense auto flowing grid so containers of mixed footprints pack together
 * without gaps. The grid widens to four columns on desktop and collapses to two on mobile, matching
 * the wide, title free feel of the photo gallery.
 */
export function ExperimentsContent() {
  return (
    <div className="mx-auto max-w-7xl animate-page-simple">
      <div className="grid auto-rows-[150px] grid-cols-2 gap-2 [grid-auto-flow:dense] sm:auto-rows-[170px] sm:gap-2.5 md:grid-cols-4 lg:auto-rows-[195px]">
        {experiments.map((experiment, index) => (
          <ExperimentTile key={experiment.id} experiment={experiment} index={index} />
        ))}
      </div>
    </div>
  )
}
