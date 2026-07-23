export type Point3 = readonly [number, number, number]

export const AMES_VIEW_POINT: Point3 = [11.7, 1.65, -9]
export const AMES_REVEAL_POINT: Point3 = [14.2, 1.65, -4.7]
export const AMES_FIGURE_HEIGHT = 1.78
export const AMES_FIGURE_SCALE = 1

export const amesFigures = [
  { id: 'near', position: [14.6, 0.18, -11.1] as Point3, scale: AMES_FIGURE_SCALE },
  { id: 'far', position: [17.15, 0.72, -7] as Point3, scale: AMES_FIGURE_SCALE },
] as const

export const amesRoomSurfaces = {
  floor: [
    [13.65, 0.16, -12.6],
    [13.65, 0.42, -5.4],
    [18, 0.86, -6.3],
    [18, 0.16, -11.7],
  ],
  ceiling: [
    [13.65, 3.08, -12.6],
    [18, 3.25, -11.7],
    [18, 3.32, -6.3],
    [13.65, 2.82, -5.4],
  ],
  back: [
    [18, 0.16, -11.7],
    [18, 0.86, -6.3],
    [18, 3.32, -6.3],
    [18, 3.25, -11.7],
  ],
  southWall: [
    [13.65, 0.16, -12.6],
    [18, 0.16, -11.7],
    [18, 3.25, -11.7],
    [13.65, 3.08, -12.6],
  ],
  northWall: [
    [13.65, 0.42, -5.4],
    [13.65, 2.82, -5.4],
    [18, 3.32, -6.3],
    [18, 0.86, -6.3],
  ],
} satisfies Record<string, Point3[]>

function distanceXZ(a: Point3, b: Point3) {
  return Math.hypot(a[0] - b[0], a[2] - b[2])
}

export function amesViewState(position: Point3) {
  return distanceXZ(position, AMES_REVEAL_POINT) < distanceXZ(position, AMES_VIEW_POINT)
    ? 'reveal'
    : 'aperture'
}

export function angularFigureRatio(viewPoint: Point3 = AMES_VIEW_POINT) {
  const [near, far] = amesFigures
  const nearDistance = Math.hypot(
    near.position[0] - viewPoint[0],
    near.position[1] + AMES_FIGURE_HEIGHT / 2 - viewPoint[1],
    near.position[2] - viewPoint[2],
  )
  const farDistance = Math.hypot(
    far.position[0] - viewPoint[0],
    far.position[1] + AMES_FIGURE_HEIGHT / 2 - viewPoint[1],
    far.position[2] - viewPoint[2],
  )
  return farDistance / nearDistance
}
