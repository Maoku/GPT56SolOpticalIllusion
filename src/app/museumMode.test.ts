import { museumModeFromSearch } from './museumMode'

describe('museum mode', () => {
  it('keeps the current museum as the default', () => {
    expect(museumModeFromSearch('')).toBe('v1')
  })

  it('exposes V2 behind its development route', () => {
    expect(museumModeFromSearch('?museum=v2')).toBe('v2')
  })
})
