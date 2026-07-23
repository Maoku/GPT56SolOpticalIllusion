import { fireEvent, render, screen } from '@testing-library/react'
import { exhibitById } from '../exhibits/exhibitCatalog'
import { createExhibitOutcome } from '../state/outcomes'
import { useMuseumStore } from '../state/useMuseumStore'
import { PerceptionPassport } from './PerceptionPassport'

describe('perception passport', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '?museum=v2')
    useMuseumStore.setState({
      stage: 'exploring',
      overlay: 'passport',
      progress: {},
      outcomes: {},
      lastVisitedExhibitId: null,
    })
  })

  it('shows four non-ranking perception axes', () => {
    render(<PerceptionPassport />)
    expect(screen.getByText('PERSPECTIVE')).toBeInTheDocument()
    expect(screen.getByText('CONTEXT')).toBeInTheDocument()
    expect(screen.getByText('LIGHT')).toBeInTheDocument()
    expect(screen.getByText('MOTION')).toBeInTheDocument()
    expect(screen.getByText('0 / 4 AXES')).toBeInTheDocument()
  })

  it('renders a measured result and routes to a different next experience', () => {
    const outcome = createExhibitOutcome(exhibitById.get('muller-lyer')!, {
      metric: { label: '知覚した長さの差', value: -8, unit: '%' },
    })
    useMuseumStore.setState({
      progress: { 'muller-lyer': 'revealed' },
      outcomes: { 'muller-lyer': outcome },
      lastVisitedExhibitId: 'muller-lyer',
    })
    render(<PerceptionPassport />)

    expect(screen.getByText('-8%')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'この展示へ' }))
    expect(useMuseumStore.getState()).toMatchObject({
      stage: 'spatial-exhibit',
      activeExhibitId: 'parallax-bloom',
      overlay: 'none',
    })
  })
})
