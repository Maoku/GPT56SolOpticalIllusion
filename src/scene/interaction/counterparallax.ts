export type CounterparallaxMode = 'normal' | 'reverse'

export const COUNTERPARALLAX_ORIGIN_X = 12
export const COUNTERPARALLAX_REVERSE_GAIN = 1.65
export const COUNTERPARALLAX_MAX_OFFSET = 1.65

export function counterparallaxMode(step: number): CounterparallaxMode {
  return step % 2 === 0 ? 'normal' : 'reverse'
}

export function counterparallaxLayerX(
  cameraX: number,
  mode: CounterparallaxMode,
) {
  if (mode === 'normal') return 0
  const offset = (cameraX - COUNTERPARALLAX_ORIGIN_X) * COUNTERPARALLAX_REVERSE_GAIN
  return Math.max(-COUNTERPARALLAX_MAX_OFFSET, Math.min(COUNTERPARALLAX_MAX_OFFSET, offset))
}

export function counterparallaxScreenMotion(
  fromCameraX: number,
  toCameraX: number,
  mode: CounterparallaxMode,
) {
  const fromProjectedX = counterparallaxLayerX(fromCameraX, mode) - fromCameraX
  const toProjectedX = counterparallaxLayerX(toCameraX, mode) - toCameraX
  return toProjectedX - fromProjectedX
}

export function counterparallaxStaticViews(mode: CounterparallaxMode) {
  return [-0.8, 0.8].map((cameraOffset) => ({
    cameraOffset,
    layerOffset: counterparallaxLayerX(
      COUNTERPARALLAX_ORIGIN_X + cameraOffset,
      mode,
    ),
  }))
}
