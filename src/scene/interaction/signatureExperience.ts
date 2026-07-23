import type { Point3 } from './amesRoom'

export const signaturePrimaryActions = {
  'parallax-bloom': 'align-by-lateral-walk',
  'chromatic-echo-corridor': 'traverse-depth-sequence',
  'folded-corridor': 'reveal-from-side-path',
  'counterparallax-window': 'compare-lateral-motion',
} as const

export const FOLDED_VIEW_POINT: Point3 = [6, 1.65, -11]
export const FOLDED_REVEAL_POINT: Point3 = [8.4, 1.65, -14.2]

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
