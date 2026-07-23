import { museumModeFromSearch } from './museumMode'

describe('museum mode', () => {
  it('uses V2 as the default', () => {
    expect(museumModeFromSearch('')).toBe('v2')
  })

  it('keeps an explicit V2 parameter compatible', () => {
    expect(museumModeFromSearch('?museum=v2')).toBe('v2')
  })

  it('exposes V1 through an explicit parameter', () => {
    expect(museumModeFromSearch('?museum=v1')).toBe('v1')
  })
})
