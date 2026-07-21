import { actionForKeyboardCode } from './useUnifiedInput'

describe('unified input mapping', () => {
  it.each([
    ['KeyW', 'move-forward'],
    ['ArrowDown', 'move-backward'],
    ['KeyE', 'interact'],
    ['KeyH', 'hint'],
    ['KeyR', 'reset'],
  ])('maps %s to %s', (code, expected) => {
    expect(actionForKeyboardCode(code)).toBe(expected)
  })
})
