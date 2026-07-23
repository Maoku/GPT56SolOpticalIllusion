import { fireEvent, render, screen } from '@testing-library/react'
import { useMuseumStore } from '../state/useMuseumStore'
import { SpatialExhibitHud } from './SpatialExhibitHud'

describe('spatial exhibit HUD', () => {
  beforeEach(() => {
    useMuseumStore.setState({
      stage: 'spatial-exhibit',
      activeExhibitId: 'parallax-bloom',
      spatialStep: 0,
      alignmentError: 0,
      cameraRequest: null,
      progress: {},
      outcomes: {},
    })
  })

  it('offers a deterministic move to the viewing spot', () => {
    render(<SpatialExhibitHud />)
    fireEvent.click(screen.getByRole('button', { name: '鑑賞点へ移動' }))
    expect(useMuseumStore.getState().cameraRequest).toMatchObject({
      position: [-6, 1.65, -10.8],
      target: [-6, 2.25, -17],
    })
  })

  it('records interaction and reveal while comparing states', () => {
    render(<SpatialExhibitHud />)
    fireEvent.click(screen.getByRole('button', { name: '状態を切り替える' }))
    expect(useMuseumStore.getState()).toMatchObject({
      spatialStep: 1,
      progress: { 'parallax-bloom': 'revealed' },
    })
  })

  it('stores a reusable alignment outcome', () => {
    render(<SpatialExhibitHud />)
    fireEvent.click(screen.getByRole('button', { name: '結果を記録' }))
    expect(useMuseumStore.getState().outcomes['parallax-bloom']).toMatchObject({
      kind: 'alignment',
      axis: 'perspective',
      metric: { value: 0, unit: 'px' },
    })
  })
})
