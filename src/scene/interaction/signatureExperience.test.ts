import {
  FOLDED_REVEAL_POINT,
  FOLDED_VIEW_POINT,
  chromaticLightingForPhase,
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

  it('keeps the ECHO room physically neutral in every phase', () => {
    expect(chromaticLightingForPhase(true, 0).echoSurfaceColor).toBe('#e9e6df')
    expect(chromaticLightingForPhase(true, 2)).toMatchObject({
      adaptIntensity: 0,
      resultColor: '#ffffff',
      echoSurfaceColor: '#e9e6df',
    })
  })

  it('reveals the folded corridor from a physical side path', () => {
    expect(foldedViewState(FOLDED_VIEW_POINT)).toBe('aligned')
    expect(foldedViewState(FOLDED_REVEAL_POINT)).toBe('reveal')
  })
})
