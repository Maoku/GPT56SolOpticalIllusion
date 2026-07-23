import { useMuseumStore } from '../state/useMuseumStore'
import { applyUrlState } from './bootstrap'

describe('URL bootstrap', () => {
  beforeEach(() => useMuseumStore.setState({ stage: 'title', activeExhibitId: null }))

  it('opens a valid exhibit deep link', () => {
    applyUrlState('?exhibit=parallax-bloom')
    expect(useMuseumStore.getState()).toMatchObject({ stage: 'exhibit', activeExhibitId: 'parallax-bloom' })
  })

  it('opens a V2 room deep link inside the spatial shell', () => {
    applyUrlState('?museum=v2&exhibit=parallax-bloom')
    expect(useMuseumStore.getState()).toMatchObject({ stage: 'spatial-exhibit', activeExhibitId: 'parallax-bloom' })
  })

  it('ignores an unknown exhibit', () => {
    applyUrlState('?exhibit=not-real')
    expect(useMuseumStore.getState().stage).toBe('title')
  })
})
