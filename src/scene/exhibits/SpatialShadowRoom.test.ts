import {
  CHECKER_TARGET_COLOR,
  checkerPointInShadow,
  checkerSceneStates,
  checkerTargets,
} from '../interaction/checkerShadow'

describe('checker shadow scene contract', () => {
  it('uses the same physical color for A and B while placing only B in shadow', () => {
    expect(CHECKER_TARGET_COLOR).toBe('#747985')
    expect(checkerTargets.A.inShadow).toBe(false)
    expect(checkerTargets.B.inShadow).toBe(true)
    expect(checkerTargets.B.position[2]).toBeGreaterThan(checkerTargets.A.position[2])
  })

  it('places B inside the authored umbra and keeps A outside it', () => {
    expect(checkerPointInShadow(checkerTargets.A.position)).toBe(false)
    expect(checkerPointInShadow(checkerTargets.B.position)).toBe(true)
  })

  it('removes context and directly connects the targets in the neutral state', () => {
    expect(checkerSceneStates[0]).toMatchObject({
      castsContextShadow: true,
      connectsTargets: false,
    })
    expect(checkerSceneStates[2]).toMatchObject({
      castsContextShadow: false,
      connectsTargets: true,
    })
  })
})
