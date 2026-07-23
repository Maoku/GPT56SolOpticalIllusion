import {
  COUNTERPARALLAX_ORIGIN_X,
  counterparallaxLayerX,
  counterparallaxMode,
  counterparallaxScreenMotion,
  counterparallaxStaticViews,
} from './counterparallax'

describe('counterparallax scene transform', () => {
  it('keeps the rear room fixed in normal parallax mode', () => {
    expect(counterparallaxLayerX(COUNTERPARALLAX_ORIGIN_X - 1, 'normal')).toBe(0)
    expect(counterparallaxLayerX(COUNTERPARALLAX_ORIGIN_X + 1, 'normal')).toBe(0)
  })

  it('reverses projected motion direction in reverse parallax mode', () => {
    const normal = counterparallaxScreenMotion(11.5, 12.5, 'normal')
    const reverse = counterparallaxScreenMotion(11.5, 12.5, 'reverse')
    expect(normal).toBeLessThan(0)
    expect(reverse).toBeGreaterThan(0)
  })

  it('maps the scene step to explicit normal and reverse modes', () => {
    expect(counterparallaxMode(0)).toBe('normal')
    expect(counterparallaxMode(1)).toBe('reverse')
  })

  it('provides two deterministic static views for reduced motion', () => {
    const [left, right] = counterparallaxStaticViews('reverse')
    expect(left!.cameraOffset).toBeLessThan(0)
    expect(right!.cameraOffset).toBeGreaterThan(0)
    expect(left!.layerOffset).toBeLessThan(0)
    expect(right!.layerOffset).toBeGreaterThan(0)
  })
})
