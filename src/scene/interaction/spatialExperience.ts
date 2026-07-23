import type { ExhibitType } from '../../exhibits/exhibitCatalog'

const spatialStepCounts: Partial<Record<ExhibitType, number>> = {
  'checker-shadow': 3,
}

export function nextSpatialStep(id: ExhibitType, current: number) {
  const count = spatialStepCounts[id]
  return count ? (current + 1) % count : null
}
