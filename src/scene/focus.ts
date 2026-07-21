import type { ExhibitDefinition } from '../exhibits/exhibitCatalog'

type Vec2 = [number, number]

export function selectFocusedExhibit(
  player: Vec2,
  forward: Vec2,
  exhibits: ExhibitDefinition[],
  minimumDot = 0.5,
) {
  let result: ExhibitDefinition | null = null
  let bestScore = Number.POSITIVE_INFINITY

  for (const exhibit of exhibits) {
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

export function zoneForPosition(x: number, z: number) {
  if (z > 8) return 'ロビー'
  if (z < -5) return '空間と残像'
  return x < 0 ? '形と大きさ' : '光と運動'
}
