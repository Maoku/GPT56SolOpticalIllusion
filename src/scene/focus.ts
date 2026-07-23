import type { ExhibitDefinition } from '../exhibits/exhibitCatalog'

type Vec2 = readonly [number, number]

export const INTERACTION_EXIT_PADDING = 0.65

function anchorDistance(player: Vec2, position: [number, number, number]) {
  return Math.hypot(position[0] - player[0], position[2] - player[1])
}

export function isInsideInteractionRegion(
  player: Vec2,
  exhibit: ExhibitDefinition,
  padding = 0,
) {
  return Boolean(exhibit.interactionAnchors?.some(
    (anchor) => anchorDistance(player, anchor.position) <= anchor.radius + padding,
  ))
}

function selectAnchorExhibit(
  player: Vec2,
  forward: Vec2,
  exhibits: ExhibitDefinition[],
) {
  const candidates = exhibits.flatMap((exhibit) =>
    (exhibit.interactionAnchors ?? [])
      .map((anchor) => {
        const dx = anchor.position[0] - player[0]
        const dz = anchor.position[2] - player[1]
        const distance = Math.hypot(dx, dz)
        if (distance > anchor.radius) return null
        const dot = distance < 0.001
          ? 1
          : (dx / distance) * forward[0] + (dz / distance) * forward[1]
        return { exhibit, normalizedDistance: distance / anchor.radius, dot }
      })
      .filter((candidate): candidate is NonNullable<typeof candidate> => candidate !== null),
  )

  if (candidates.length === 0) return null
  candidates.sort((a, b) =>
    a.normalizedDistance - b.normalizedDistance || b.dot - a.dot,
  )
  return candidates[0]!.exhibit
}

export function selectFocusedExhibit(
  player: Vec2,
  forward: Vec2,
  exhibits: ExhibitDefinition[],
  minimumDot = 0.5,
) {
  const anchored = selectAnchorExhibit(player, forward, exhibits)
  if (anchored) return anchored

  let result: ExhibitDefinition | null = null
  let bestScore = Number.POSITIVE_INFINITY

  for (const exhibit of exhibits) {
    if (exhibit.interactionAnchors?.length) continue
    const dx = exhibit.position[0] - player[0]
    const dz = exhibit.position[2] - player[1]
    const distance = Math.hypot(dx, dz)
    if (distance > exhibit.interactionDistance || distance < 0.001) continue
    const dot = (dx / distance) * forward[0] + (dz / distance) * forward[1]
    if (dot < minimumDot) continue
    const score = distance + (1 - dot) * 3
    if (score < bestScore) {
      bestScore = score
      result = exhibit
    }
  }
  return result
}

export function zoneForPosition(x: number, z: number, mode: 'v1' | 'v2' = 'v2') {
  if (mode === 'v2') {
    if (z > 10) return 'CLASSICS LAB'
    if (z < -10) return 'SIGNATURE HALL'
    if (x > 10) return 'SCALE + LIGHT'
    return 'ARRIVAL ATRIUM'
  }
  if (z > 8) return 'ロビー'
  if (z < -5) return '空間と残像'
  return x < 0 ? '形と大きさ' : '光と運動'
}
