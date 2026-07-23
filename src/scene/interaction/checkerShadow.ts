export const CHECKER_TARGET_COLOR = '#747985'

export const checkerTargets = {
  A: { position: [15.92, 0.052, -0.36] as const, inShadow: false },
  B: { position: [16.64, 0.052, 0.36] as const, inShadow: true },
}

export const checkerShadowMask = {
  position: [checkerTargets.B.position[0], 0.058, checkerTargets.B.position[2]] as const,
  radiusX: 0.64,
  radiusZ: 0.48,
  angle: -0.28,
}

export function checkerPointInShadow(position: readonly [number, number, number]) {
  const dx = position[0] - checkerShadowMask.position[0]
  const dz = position[2] - checkerShadowMask.position[2]
  const cos = Math.cos(-checkerShadowMask.angle)
  const sin = Math.sin(-checkerShadowMask.angle)
  const localX = dx * cos - dz * sin
  const localZ = dx * sin + dz * cos
  return (
    (localX * localX) / (checkerShadowMask.radiusX * checkerShadowMask.radiusX) +
      (localZ * localZ) / (checkerShadowMask.radiusZ * checkerShadowMask.radiusZ) <=
    1
  )
}

export const checkerSceneStates = [
  { id: 'shadow', castsContextShadow: true, connectsTargets: false },
  { id: 'context', castsContextShadow: false, connectsTargets: false },
  { id: 'neutral', castsContextShadow: false, connectsTargets: true },
] as const
