import {
  FOLDED_REVEAL_POINT,
  FOLDED_VIEW_POINT,
  chromaticPhaseForPosition,
  foldedViewState,
  signaturePrimaryActions,
} from './signatureExperience'

describe('signature hall experience contracts', () => {
  it('gives all four installations a distinct primary bodily action', () => {
    const actions = Object.values(signaturePrimaryActions)
    expect(new Set(actions).size).toBe(actions.length)
  })

  it('derives the chromatic sequence from walking deeper into the corridor', () => {
    expect(chromaticPhaseForPosition([0, 1.65, -12.5])).toBe(0)
    expect(chromaticPhaseForPosition([0, 1.65, -14.7])).toBe(1)
    expect(chromaticPhaseForPosition([0, 1.65, -16.4])).toBe(2)
  })

  it('reveals the folded corridor from a physical side path', () => {
    expect(foldedViewState(FOLDED_VIEW_POINT)).toBe('aligned')
    expect(foldedViewState(FOLDED_REVEAL_POINT)).toBe('reveal')
  })
})
