import { Vector2, Vector3, type Camera } from 'three'
import type { ExhibitType, ViewSpot } from '../../exhibits/exhibitCatalog'

export const spatialAlignmentAnchors: Partial<Record<ExhibitType, [number, number, number][]>> = {
  'parallax-bloom': [
    [-6, 2.13, -15.8],
    [-6, 2.21, -16.6],
    [-6, 2.29, -17.4],
  ],
  'folded-corridor': [
    [6, 1.54, -15.2],
    [6, 1.52, -16],
    [6, 1.5, -16.8],
  ],
}

export function viewSpotDistance(
  position: [number, number, number],
  viewSpot: ViewSpot,
) {
  return Math.hypot(
    position[0] - viewSpot.position[0],
    position[2] - viewSpot.position[2],
  )
}

export function projectedAlignmentError(
  camera: Camera,
  anchors: [number, number, number][],
  viewport: { width: number; height: number },
) {
  if (anchors.length < 2) return 0
  const projected = anchors.map((anchor) => {
    const point = new Vector3(...anchor).project(camera)
    return new Vector2(
      (point.x + 1) * viewport.width * 0.5,
      (1 - point.y) * viewport.height * 0.5,
    )
  })
  const centroid = projected
    .reduce((sum, point) => sum.add(point), new Vector2())
    .multiplyScalar(1 / projected.length)
  return Math.max(...projected.map((point) => point.distanceTo(centroid)))
}
