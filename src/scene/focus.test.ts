import { exhibitCatalog } from '../exhibits/exhibitCatalog'
import {
  INTERACTION_EXIT_PADDING,
  isInsideInteractionRegion,
  selectFocusedExhibit,
  zoneForPosition,
} from './focus'

describe('exhibit focus', () => {
  it('selects a nearby exhibit in front of the player', () => {
    const focused = selectFocusedExhibit([-12, 13], [0, 1], exhibitCatalog)
    expect(focused?.id).toBe('muller-lyer')
  })

  it('does not select a nearby exhibit behind the player', () => {
    expect(selectFocusedExhibit([-12, 13], [0, -1], exhibitCatalog)).toBeNull()
  })

  it.each([
    ['checker-shadow', [12.8, 0]],
    ['ames-room', [11.7, -9]],
    ['parallax-bloom', [-10, -10.8]],
    ['chromatic-echo-corridor', [-2.5, -11.5]],
    ['folded-corridor', [4.5, -10.4]],
    ['counterparallax-window', [12, -11.4]],
  ] as const)('focuses %s from its viewing point', (id, player) => {
    expect(selectFocusedExhibit(player, [0, -1], exhibitCatalog)?.id).toBe(id)
  })

  it('uses exit padding to prevent boundary flicker', () => {
    const exhibit = exhibitCatalog.find(({ id }) => id === 'parallax-bloom')!
    expect(isInsideInteractionRegion([-8.5, -10.8], exhibit)).toBe(false)
    expect(isInsideInteractionRegion([-8.5, -10.8], exhibit, INTERACTION_EXIT_PADDING)).toBe(true)
  })

  it('labels the V2 museum zones by default', () => {
    expect(zoneForPosition(0, 12)).toBe('CLASSICS LAB')
    expect(zoneForPosition(0, -12)).toBe('SIGNATURE HALL')
    expect(zoneForPosition(12, 0)).toBe('SCALE + LIGHT')
    expect(zoneForPosition(0, 0)).toBe('ARRIVAL ATRIUM')
  })

  it('labels the V1 museum zones when requested', () => {
    expect(zoneForPosition(0, 12, 'v1')).toBe('ロビー')
    expect(zoneForPosition(-8, 0, 'v1')).toBe('形と大きさ')
    expect(zoneForPosition(8, 0, 'v1')).toBe('光と運動')
    expect(zoneForPosition(0, -10, 'v1')).toBe('空間と残像')
  })
})
