import { nextSpatialStep } from './spatialExperience'

describe('spatial exhibit operation', () => {
  it('cycles the checker lighting through scene-backed states', () => {
    expect(nextSpatialStep('checker-shadow', 0)).toBe(1)
    expect(nextSpatialStep('checker-shadow', 1)).toBe(2)
    expect(nextSpatialStep('checker-shadow', 2)).toBe(0)
  })

  it('does not invent a button-driven state for walking exhibits', () => {
    expect(nextSpatialStep('parallax-bloom', 0)).toBeNull()
  })

  it('switches the counterparallax scene between normal and reverse modes', () => {
    expect(nextSpatialStep('counterparallax-window', 0)).toBe(1)
    expect(nextSpatialStep('counterparallax-window', 1)).toBe(0)
  })
})
