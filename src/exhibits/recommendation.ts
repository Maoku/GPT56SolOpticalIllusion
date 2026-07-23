import {
  exhibitById,
  exhibitCatalog,
  type ExhibitDefinition,
  type ExhibitType,
} from './exhibitCatalog'
import type { ExhibitProgress } from '../state/useMuseumStore'

export function recommendNextExhibit(
  progress: Record<string, ExhibitProgress>,
  lastVisitedExhibitId: ExhibitType | null,
): ExhibitDefinition | null {
  const unvisited = exhibitCatalog.filter(
    (exhibit) => (progress[exhibit.id] ?? 'unvisited') === 'unvisited',
  )
  if (unvisited.length === 0) return null

  const last = lastVisitedExhibitId ? exhibitById.get(lastVisitedExhibitId) : undefined
  if (!last) return unvisited.find((exhibit) => exhibit.presentation !== 'lab') ?? unvisited[0]!

  const direct = last.recommendedAfter
    .map((id) => exhibitById.get(id))
    .find(
      (candidate) =>
        candidate &&
        (progress[candidate.id] ?? 'unvisited') === 'unvisited' &&
        candidate.interaction.mode !== last.interaction.mode,
    )
  if (direct) return direct

  return (
    unvisited.find(
      (candidate) =>
        candidate.interaction.mode !== last.interaction.mode &&
        candidate.perceptionAxis !== last.perceptionAxis,
    ) ??
    unvisited.find((candidate) => candidate.interaction.mode !== last.interaction.mode) ??
    unvisited[0]!
  )
}
