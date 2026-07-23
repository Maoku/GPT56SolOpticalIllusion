import type { ExhibitType } from '../../exhibits/exhibitCatalog'

export const classicsLiveEffects = {
  'muller-lyer': 'equal-lines-opposing-fins',
  ponzo: 'equal-bars-converging-depth',
  ebbinghaus: 'equal-centers-opposing-context',
  'cafe-wall': 'offset-tile-rows',
  'necker-cube': 'ambiguous-line-cube',
  'motion-induced-blindness': 'fixation-static-targets-moving-field',
} as const satisfies Partial<Record<ExhibitType, string>>

const classicsStepCounts: Partial<Record<ExhibitType, number>> = {
  'muller-lyer': 5,
  ponzo: 4,
  ebbinghaus: 2,
  'cafe-wall': 4,
  'necker-cube': 2,
  'motion-induced-blindness': 2,
}

export function isLiveClassic(id: ExhibitType) {
  return id in classicsLiveEffects
}

export function nextClassicsStep(id: ExhibitType, current: number) {
  const count = classicsStepCounts[id]
  return count ? (current + 1) % count : null
}
