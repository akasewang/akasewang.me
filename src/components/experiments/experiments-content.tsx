'use client'

import { ExperimentTile } from './experiment-tile'
import { experiments } from './experiments'

export function ExperimentsContent() {
  return (
    <div className="mx-auto max-w-7xl animate-page-simple">
      <div className="grid auto-rows-[150px] grid-cols-2 gap-2 sm:auto-rows-[170px] sm:gap-2.5 md:grid-cols-6 lg:auto-rows-[195px]">
        {experiments.map((experiment, index) => (
          <ExperimentTile key={experiment.id} experiment={experiment} index={index} />
        ))}
      </div>
    </div>
  )
}
