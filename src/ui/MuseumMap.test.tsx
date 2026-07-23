import { fireEvent, render, screen, within } from '@testing-library/react'
import { exhibitCatalog } from '../exhibits/exhibitCatalog'
import { useMuseumStore } from '../state/useMuseumStore'
import { MuseumMap } from './MuseumMap'
import { CompletionMessage } from './MuseumStatus'

describe('museum progress UI', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/')
    useMuseumStore.setState({ progress: {}, overlay: 'map' })
  })

  it('uses text and symbols as well as color for progress', () => {
    useMuseumStore.setState({ progress: { 'muller-lyer': 'revealed', ponzo: 'interacted' } })
    render(<MuseumMap />)
    expect(screen.getByText('答え合わせ済み')).toBeInTheDocument()
    expect(screen.getByText('操作済み')).toBeInTheDocument()
    expect(screen.getAllByText('未体験')).toHaveLength(10)
  })

  it('announces completion after all twelve exhibits were experienced', () => {
    useMuseumStore.setState({ progress: Object.fromEntries(exhibitCatalog.map((item) => [item.id, 'interacted'])) })
    render(<CompletionMessage />)
    expect(screen.getByRole('status')).toHaveTextContent('12 / 12')
  })

  it('opens a default V2 spatial exhibit without adding a museum parameter', () => {
    render(<MuseumMap />)
    const row = screen.getByText('視差の花').closest('li')
    expect(row).not.toBeNull()
    fireEvent.click(within(row!).getByRole('button', { name: '開く' }))
    expect(useMuseumStore.getState()).toMatchObject({
      stage: 'spatial-exhibit',
      activeExhibitId: 'parallax-bloom',
      overlay: 'none',
    })
    expect(window.location.search).toContain('exhibit=parallax-bloom')
    expect(new URLSearchParams(window.location.search).has('museum')).toBe(false)
  })
})
