import { exhibitCatalog, exhibitById, legacyExhibitCatalog } from './exhibitCatalog'

describe('V2 exhibit catalog', () => {
  it('defines twelve exhibits while retaining every legacy id', () => {
    expect(exhibitCatalog).toHaveLength(12)
    expect(legacyExhibitCatalog).toHaveLength(10)
    expect(new Set(exhibitCatalog.map((exhibit) => exhibit.id)).size).toBe(12)
  })

  it('provides six spatial exhibits and four originals', () => {
    expect(exhibitCatalog.filter((exhibit) => exhibit.presentation !== 'lab')).toHaveLength(6)
    expect(exhibitCatalog.filter((exhibit) => exhibit.isOriginal)).toHaveLength(4)
  })

  it('keeps recommendations and view spots valid', () => {
    for (const exhibit of exhibitCatalog) {
      expect(exhibit.recommendedAfter.every((id) => exhibitById.has(id))).toBe(true)
      if (exhibit.presentation !== 'lab') {
        expect(exhibit.viewSpots?.length).toBeGreaterThan(0)
      }
    }
  })
})
