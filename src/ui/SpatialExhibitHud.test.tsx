import { fireEvent, render, screen } from '@testing-library/react'
import { useMuseumStore } from '../state/useMuseumStore'
import { SpatialExhibitHud } from './SpatialExhibitHud'

describe('spatial exhibit HUD', () => {
  beforeEach(() => {
    useMuseumStore.setState({
      stage: 'spatial-exhibit',
      activeExhibitId: 'parallax-bloom',
      spatialStep: 0,
      spatialHintVisible: false,
      alignmentError: 0,
      cameraRequest: null,
      progress: {},
      outcomes: {},
    })
  })

  it('keeps the viewing action in the scene instead of a HUD button', () => {
    render(<SpatialExhibitHud />)
    expect(screen.getByText('床マーカーの周囲を歩き、三層が一輪になる位置を探します。')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '鑑賞点へ移動' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '状態を切り替える' })).not.toBeInTheDocument()
  })

  it('shows a one-line hint without opening a modal', () => {
    useMuseumStore.setState({ spatialHintVisible: true })
    render(<SpatialExhibitHud />)
    expect(screen.getByText('mint色の床マーカーから花弁の中心を見ます。')).toBeInTheDocument()
    expect(useMuseumStore.getState().overlay).toBe('none')
  })

  it('offers detail only after the inline hint is visible', () => {
    useMuseumStore.setState({ spatialHintVisible: true })
    render(<SpatialExhibitHud />)
    fireEvent.click(screen.getByRole('button', { name: '詳しい解説' }))
    expect(useMuseumStore.getState().overlay).toBe('hint')
  })
})
