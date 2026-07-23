import { fireEvent, render, screen } from '@testing-library/react'
import { useMuseumStore } from '../state/useMuseumStore'
import { ExhibitPrompt } from './ExhibitPrompt'

describe('V2 live classic prompt', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '?museum=v2')
    useMuseumStore.setState({
      stage: 'exploring',
      focusedExhibitId: 'muller-lyer',
      activeExhibitId: null,
      progress: {},
      liveExhibitSteps: {},
    })
  })

  it('operates the in-gallery exhibit without opening the full-screen experiment', () => {
    render(<ExhibitPrompt />)
    fireEvent.click(screen.getByRole('button', { name: /展示台を操作/ }))
    expect(useMuseumStore.getState()).toMatchObject({
      stage: 'exploring',
      activeExhibitId: null,
      liveExhibitSteps: { 'muller-lyer': 1 },
      progress: { 'muller-lyer': 'interacted' },
    })
  })

  it('keeps the detailed experiment as an optional action', () => {
    render(<ExhibitPrompt />)
    fireEvent.click(screen.getByRole('button', { name: '詳細実験' }))
    expect(useMuseumStore.getState()).toMatchObject({
      stage: 'exhibit',
      activeExhibitId: 'muller-lyer',
    })
  })
})
