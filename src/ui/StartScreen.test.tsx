import { render, screen } from '@testing-library/react'
import { useMuseumStore } from '../state/useMuseumStore'
import { StartScreen } from './StartScreen'

describe('V2 start screen', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '?museum=v2')
    useMuseumStore.setState({
      progress: {},
      outcomes: {},
      lastVisitedExhibitId: null,
      stage: 'title',
      overlay: 'none',
    })
  })

  it('states the spatial museum promise and catalog size', () => {
    render(<StartScreen />)
    expect(screen.getByText('12の錯視。6つの部屋。あなたの目だけが作る結果。')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('6')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
  })

  it('offers resume, passport, and free-entry choices on a return visit', () => {
    useMuseumStore.setState({
      progress: { 'parallax-bloom': 'interacted' },
      lastVisitedExhibitId: 'parallax-bloom',
    })
    render(<StartScreen />)
    expect(screen.getByRole('button', { name: /続きから/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'パスポートを見る' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '自由に入館' })).toBeInTheDocument()
  })
})
