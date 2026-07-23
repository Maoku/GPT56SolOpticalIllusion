export type Point2 = [number, number]
export type CollisionRect = { minX: number; maxX: number; minZ: number; maxZ: number }

export const MUSEUM_BOUNDS: CollisionRect = { minX: -18.2, maxX: 18.2, minZ: -17.2, maxZ: 16.2 }

export const museumColliders: CollisionRect[] = [
  { minX: -2.3, maxX: 2.3, minZ: 5.5, maxZ: 6.1 },
  { minX: -2.3, maxX: 2.3, minZ: -6.2, maxZ: -5.6 },
]

export const v2MuseumColliders: CollisionRect[] = [
  { minX: -2.35, maxX: -1.95, minZ: 7.15, maxZ: 7.65 },
  { minX: 1.95, maxX: 2.35, minZ: 7.15, maxZ: 7.65 },
  { minX: -2.35, maxX: -1.95, minZ: -11.35, maxZ: -10.85 },
  { minX: 1.95, maxX: 2.35, minZ: -11.35, maxZ: -10.85 },
  { minX: 11.25, maxX: 11.75, minZ: -2.35, maxZ: -1.95 },
  { minX: 11.25, maxX: 11.75, minZ: 1.95, maxZ: 2.35 },
]

function inside(point: Point2, rect: CollisionRect, radius = 0) {
  return (
    point[0] >= rect.minX - radius &&
    point[0] <= rect.maxX + radius &&
    point[1] >= rect.minZ - radius &&
    point[1] <= rect.maxZ + radius
  )
}

export function resolvePlayerPosition(
  current: Point2,
  candidate: Point2,
  radius = 0.38,
  mode: 'v1' | 'v2' = 'v1',
): Point2 {
  const clamped: Point2 = [
    Math.min(MUSEUM_BOUNDS.maxX, Math.max(MUSEUM_BOUNDS.minX, candidate[0])),
    Math.min(MUSEUM_BOUNDS.maxZ, Math.max(MUSEUM_BOUNDS.minZ, candidate[1])),
  ]
  const colliders = mode === 'v2' ? v2MuseumColliders : museumColliders
  if (colliders.some((collider) => inside(clamped, collider, radius))) return current
  return clamped
}
