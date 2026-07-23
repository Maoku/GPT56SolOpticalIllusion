import { resolvePlayerPosition } from './CollisionWorld'

describe('museum collision world', () => {
  it('clamps the player to outer bounds', () => {
    expect(resolvePlayerPosition([0, 0], [99, -99])).toEqual([18.2, -17.2])
  })

  it('rejects movement into a V1 gallery divider when requested', () => {
    expect(resolvePlayerPosition([0, 5], [0, 5.8], 0.38, 'v1')).toEqual([0, 5])
  })

  it('uses V2 portal collision by default', () => {
    expect(resolvePlayerPosition([0, 8], [0, 7.4])).toEqual([0, 7.4])
    expect(resolvePlayerPosition([-3, 7.4], [-2.1, 7.4])).toEqual([-3, 7.4])
  })
})
