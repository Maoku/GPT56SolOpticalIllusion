import { render, screen } from '@testing-library/react'
import { exhibitCatalog } from '../exhibits/exhibitCatalog'
import { useMuseumStore } from '../state/useMuseumStore'
import { MuseumMap } from './MuseumMap'
import { CompletionMessage } from './MuseumStatus'

describe('museum progress UI', () => {
  beforeEach(() => useMuseumStore.setState({ progress: {}, overlay: 'map' }))

  it('uses text and symbols as well as color for progress', () => {
    useMuseumStore.setState({ progress: { 'muller-lyer': 'revealed', ponzo: 'interacted' } })
    render(<MuseumMap />)
    expect(screen.getByText('答え合わせ済み')).toBeInTheDocument()
    expect(screen.getByText('操作済み')).toBeInTheDocument()
    expect(screen.getAllByText('未体験')).toHaveLength(8)
  })

  it('announces completion after all ten exhibits were experienced', () => {
    useMuseumStore.setState({ progress: Object.fromEntries(exhibitCatalog.map((item) => [item.id, 'interacted'])) })
    render(<CompletionMessage />)
    expect(screen.getByRole('status')).toHaveTextContent('10 / 10')
  })
})
