import { cameraAnglesForTarget } from './cameraPose'

describe('camera target pose', () => {
  it('looks downward when the requested target is below eye level', () => {
    expect(cameraAnglesForTarget({
      position: [12.8, 1.65, 0],
      target: [16.28, 0.12, 0],
    }).pitch).toBeLessThan(0)
  })

  it('looks upward when the requested target is above eye level', () => {
    expect(cameraAnglesForTarget({
      position: [0, 1.65, 8],
      target: [0, 4.12, 1.5],
    }).pitch).toBeGreaterThan(0)
  })
})
