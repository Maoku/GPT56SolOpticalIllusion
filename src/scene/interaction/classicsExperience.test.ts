import {
  classicsLiveEffects,
  isLiveClassic,
  nextClassicsStep,
} from './classicsExperience'

describe('Classics Lab live exhibit contracts', () => {
  it('defines a distinct live effect for all six classics', () => {
    expect(Object.keys(classicsLiveEffects)).toHaveLength(6)
    expect(new Set(Object.values(classicsLiveEffects)).size).toBe(6)
  })

  it('provides one cyclic scene operation per classic exhibit', () => {
    for (const id of Object.keys(classicsLiveEffects) as (keyof typeof classicsLiveEffects)[]) {
      expect(nextClassicsStep(id, 0)).not.toBeNull()
      expect(isLiveClassic(id)).toBe(true)
    }
  })

  it('does not treat a spatial installation as a classic control', () => {
    expect(nextClassicsStep('parallax-bloom', 0)).toBeNull()
    expect(isLiveClassic('parallax-bloom')).toBe(false)
  })
})
