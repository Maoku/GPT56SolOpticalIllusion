import { exhibitCatalog } from '../exhibits/exhibitCatalog'
import { selectFocusedExhibit, zoneForPosition } from './focus'

describe('exhibit focus', () => {
  it('selects a nearby exhibit in front of the player', () => {
    const focused = selectFocusedExhibit([-12, 13], [0, 1], exhibitCatalog)
    expect(focused?.id).toBe('muller-lyer')
  })

  it('does not select a nearby exhibit behind the player', () => {
    expect(selectFocusedExhibit([-12, 13], [0, -1], exhibitCatalog)).toBeNull()
  })

  it('labels the three museum zones', () => {
    expect(zoneForPosition(0, 12)).toBe('ロビー')
    expect(zoneForPosition(-8, 0)).toBe('形と大きさ')
    expect(zoneForPosition(8, 0)).toBe('光と運動')
    expect(zoneForPosition(0, -10)).toBe('空間と残像')
  })
})
