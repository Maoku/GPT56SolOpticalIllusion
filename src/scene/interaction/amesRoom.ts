export type Point3 = readonly [number, number, number]

export const AMES_VIEW_POINT: Point3 = [12.7, 1.65, -9]
export const AMES_REVEAL_POINT: Point3 = [15.1, 1.65, -5.8]
export const AMES_FIGURE_HEIGHT = 1.78
export const AMES_FIGURE_SCALE = 1

export const amesFigures = [
  { id: 'near', position: [15.25, 0.18, -10.55] as Point3, scale: AMES_FIGURE_SCALE },
  { id: 'far', position: [17.25, 0.72, -7.55] as Point3, scale: AMES_FIGURE_SCALE },
] as const

export const amesRoomSurfaces = {
  floor: [
    [14.65, 0.16, -11.45],
    [14.65, 0.42, -6.75],
    [18, 0.86, -7.35],
    [18, 0.16, -10.75],
  ],
  ceiling: [
    [14.65, 3.08, -11.45],
    [18, 3.25, -10.75],
    [18, 3.32, -7.35],
    [14.65, 2.82, -6.75],
  ],
  back: [
    [18, 0.16, -10.75],
    [18, 0.86, -7.35],
    [18, 3.32, -7.35],
    [18, 3.25, -10.75],
  ],
  southWall: [
    [14.65, 0.16, -11.45],
    [18, 0.16, -10.75],
    [18, 3.25, -10.75],
    [14.65, 3.08, -11.45],
  ],
  northWall: [
    [14.65, 0.42, -6.75],
    [14.65, 2.82, -6.75],
    [18, 3.32, -7.35],
    [18, 0.86, -7.35],
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
