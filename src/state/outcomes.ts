import type {
  ExhibitDefinition,
  ExhibitOutcomeKind,
  ExhibitType,
  PerceptionAxis,
} from '../exhibits/exhibitCatalog'

export type OutcomeMetric = {
  label: string
  value: number
  unit?: string
}

export type ExhibitOutcome = {
  exhibitId: ExhibitType
  kind: ExhibitOutcomeKind
  axis: PerceptionAxis
  recordedAt: number
  headline: string
  detail: string
  metric?: OutcomeMetric
  comparison?: [string, string]
  sequence?: string[]
}

export type OutcomeDraft = Partial<
  Pick<ExhibitOutcome, 'headline' | 'detail' | 'metric' | 'comparison' | 'sequence'>
>

export function createExhibitOutcome(
  exhibit: ExhibitDefinition,
  draft: OutcomeDraft = {},
  previous?: ExhibitOutcome,
): ExhibitOutcome {
  return {
    exhibitId: exhibit.id,
    kind: exhibit.outcomeKind,
    axis: exhibit.perceptionAxis,
    recordedAt: Date.now(),
    headline: draft.headline ?? previous?.headline ?? exhibit.shareHook,
    detail: draft.detail ?? previous?.detail ?? exhibit.oneSentence,
    metric: draft.metric ?? previous?.metric,
    comparison: draft.comparison ?? previous?.comparison,
    sequence: draft.sequence ?? previous?.sequence,
  }
}

export function isExhibitOutcome(value: unknown): value is ExhibitOutcome {
  if (!value || typeof value !== 'object') return false
  const outcome = value as Partial<ExhibitOutcome>
  return (
    typeof outcome.exhibitId === 'string' &&
    typeof outcome.kind === 'string' &&
    typeof outcome.axis === 'string' &&
    typeof outcome.recordedAt === 'number' &&
    typeof outcome.headline === 'string' &&
    typeof outcome.detail === 'string'
  )
}
