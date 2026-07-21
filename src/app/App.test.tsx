import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { App } from './App'

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => <div data-testid="canvas">{children}</div>,
}))

vi.mock('../scene/MuseumScene', () => ({ MuseumScene: () => <div /> }))

describe('App', () => {
  it('renders the 3D canvas and HTML interface together', () => {
    render(<App />)
    expect(screen.getByTestId('canvas')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'PARALLAX' })).toBeInTheDocument()
  })
})
