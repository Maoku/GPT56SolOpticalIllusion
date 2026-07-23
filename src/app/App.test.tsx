import { render, screen } from '@testing-library/react'
import { fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { App } from './App'
import { useMuseumStore } from '../state/useMuseumStore'

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => <div data-testid="canvas">{children}</div>,
  useFrame: vi.fn(),
  useThree: (selector: (state: { camera: { position: { x: number; z: number } } }) => unknown) =>
    selector({ camera: { position: { x: 0, z: 12 } } }),
}))

vi.mock('@react-three/drei', () => ({
  Html: ({
    children,
    style,
    zIndexRange,
  }: {
    children: React.ReactNode
    style?: React.CSSProperties
    zIndexRange?: number[]
  }) => (
    <div
      data-testid="three-html"
      data-z-index-range={zIndexRange?.join(',')}
      style={style}
    >
      {children}
    </div>
  ),
}))

vi.mock('../scene/MuseumScene', () => ({ MuseumScene: () => <div /> }))

describe('App', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/')
    useMuseumStore.setState({
      stage: 'title',
      overlay: 'none',
      tutorialSeen: true,
      contextPromptStep: null,
    })
  })

  it('shows the V1 tutorial only on the first visit', () => {
    window.history.pushState({}, '', '?museum=v1')
    useMuseumStore.setState({ tutorialSeen: false })
    render(<App webGLAvailable />)
    fireEvent.click(screen.getByRole('button', { name: /入館する/ }))
    expect(screen.getByRole('dialog', { name: '歩いて、見つける' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'スキップ' }))
    expect(useMuseumStore.getState().tutorialSeen).toBe(true)
    expect(useMuseumStore.getState().overlay).toBe('none')
  })

  it('enters default V2 from the title without automatically showing a hint', () => {
    render(<App webGLAvailable />)
    expect(screen.getByTestId('canvas')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'PARALLAX 2.0' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /入館する/ }))
    expect(screen.queryByRole('heading', { name: 'PARALLAX 2.0' })).not.toBeInTheDocument()
    expect(useMuseumStore.getState().stage).toBe('exploring')
    expect(useMuseumStore.getState().overlay).toBe('none')
  })

  it('removes the always-on zone telemetry from interactive overlays', () => {
    useMuseumStore.setState({ stage: 'exploring', overlay: 'tutorial', tutorialSeen: false })
    render(<App webGLAvailable />)

    expect(screen.queryByText(/ZONE —/)).not.toBeInTheDocument()
    expect(screen.queryByTestId('three-html')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: '次へ' })).toBeEnabled()
  })

  it('shows the WebGL fallback when WebGL 2 is unavailable', () => {
    render(<App webGLAvailable={false} />)
    expect(screen.getByRole('alert')).toHaveTextContent('3D 展示を表示できません')
  })
})
