import { exhibitById } from '../exhibits/exhibitCatalog'
import { createExhibitOutcome } from '../state/outcomes'
import { buildOutcomeCardSvg, buildPassportSvg } from './passportExport'

describe('passport exports', () => {
  const outcome = createExhibitOutcome(exhibitById.get('muller-lyer')!, {
    headline: '8% 短く調整した',
    metric: { label: '知覚した長さの差', value: -8, unit: '%' },
  })

  it('builds a 1200 × 630 passport image without ranking language', () => {
    const svg = buildPassportSvg({ 'muller-lyer': outcome })
    expect(svg).toContain('width="1200" height="630"')
    expect(svg).toContain('PERCEPTION PASSPORT')
    expect(svg).not.toMatch(/score|rank|優劣/i)
  })

  it('builds an exhibit result card from the same outcome data', () => {
    const svg = buildOutcomeCardSvg(outcome)
    expect(svg).toContain('ミュラー・リヤー錯視')
    expect(svg).toContain('-8%')
  })
})
