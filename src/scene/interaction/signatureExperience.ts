import type { Point3 } from './amesRoom'

export const signaturePrimaryActions = {
  'parallax-bloom': 'align-by-lateral-walk',
  'chromatic-echo-corridor': 'traverse-depth-sequence',
  'folded-corridor': 'reveal-from-side-path',
  'counterparallax-window': 'compare-lateral-motion',
} as const

export const FOLDED_VIEW_POINT: Point3 = [4.5, 1.65, -10.4]
export const FOLDED_REVEAL_POINT: Point3 = [7.7, 1.65, -14.1]

export function chromaticLightingForPhase(active: boolean, phase: number) {
  return {
    adaptIntensity: 0,
    resultIntensity: active && phase >= 2 ? 7 : 2,
    resultColor: '#ffffff',
    echoSurfaceColor: '#e9e6df',
  } as const
}

function distanceXZ(a: Point3, b: Point3) {
  return Math.hypot(a[0] - b[0], a[2] - b[2])
}

export function foldedViewState(position: Point3) {
  return distanceXZ(position, FOLDED_REVEAL_POINT) <
    distanceXZ(position, FOLDED_VIEW_POINT)
    ? 'reveal'
    : 'aligned'
}

export function chromaticPhaseForPosition(position: Point3) {
  if (position[2] > -13.9) return 0
  if (position[2] > -15.6) return 1
  return 2
}
