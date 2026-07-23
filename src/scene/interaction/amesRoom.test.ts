import {
  AMES_FIGURE_HEIGHT,
  AMES_FIGURE_SCALE,
  AMES_REVEAL_POINT,
  AMES_VIEW_POINT,
  amesFigures,
  amesRoomSurfaces,
  amesViewState,
  angularFigureRatio,
} from './amesRoom'

describe('Ames room scene contract', () => {
  it('uses identical geometry dimensions and scale for both figures', () => {
    expect(AMES_FIGURE_HEIGHT).toBeGreaterThan(0)
    expect(amesFigures).toHaveLength(2)
    expect(amesFigures.every((figure) => figure.scale === AMES_FIGURE_SCALE)).toBe(true)
  })

  it('creates a clear projected size difference from the fixed view using distance only', () => {
    expect(angularFigureRatio()).toBeGreaterThan(1.35)
  })

  it('keeps the exhibit floor above the museum floor', () => {
    expect(Math.min(...amesRoomSurfaces.floor.map((point) => point[1]))).toBeGreaterThan(0.1)
  })

  it('derives aperture and reveal modes from where the visitor walks', () => {
    expect(amesViewState(AMES_VIEW_POINT)).toBe('aperture')
    expect(amesViewState(AMES_REVEAL_POINT)).toBe('reveal')
  })
})
