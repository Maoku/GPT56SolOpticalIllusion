import { resolvePlayerPosition } from './CollisionWorld'

describe('museum collision world', () => {
  it('clamps the player to outer bounds', () => {
    expect(resolvePlayerPosition([0, 0], [99, -99])).toEqual([18.2, -17.2])
  })

  it('rejects movement into a gallery divider', () => {
    expect(resolvePlayerPosition([0, 5], [0, 5.8])).toEqual([0, 5])
  })
})
