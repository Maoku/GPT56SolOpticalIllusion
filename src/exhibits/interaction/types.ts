import type { OutcomeDraft } from '../../state/outcomes'

export type ExhibitModuleProps = {
  revealed: boolean
  onInteract: () => void
  onOutcome?: (outcome: OutcomeDraft) => void
}
