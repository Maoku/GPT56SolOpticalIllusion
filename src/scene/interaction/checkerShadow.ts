export const CHECKER_TARGET_COLOR = '#747985'

export const checkerTargets = {
  A: { position: [15.92, 0.052, 7.34] as const, inShadow: false },
  B: { position: [16.64, 0.052, 8.06] as const, inShadow: true },
}

export const checkerSceneStates = [
  { id: 'shadow', castsContextShadow: true, connectsTargets: false },
  { id: 'context', castsContextShadow: false, connectsTargets: false },
  { id: 'neutral', castsContextShadow: false, connectsTargets: true },
] as const
