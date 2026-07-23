import { PerspectiveCamera } from 'three'
import { exhibitById } from '../../exhibits/exhibitCatalog'
import {
  projectedAlignmentError,
  spatialAlignmentAnchors,
  viewSpotDistance,
} from './alignment'

describe('spatial alignment', () => {
  const bloom = exhibitById.get('parallax-bloom')!
  const spot = bloom.viewSpots![0]!

  it('measures physical distance from the viewing spot', () => {
    expect(viewSpotDistance(spot.position, spot)).toBe(0)
    expect(viewSpotDistance([spot.position[0] + 1, spot.position[1], spot.position[2]], spot)).toBe(1)
  })

  it('measures projected spread using the same anchors as the installation', () => {
    const camera = new PerspectiveCamera(58, 16 / 9, 0.1, 90)
    camera.position.set(...spot.position)
    camera.lookAt(...spot.target)
    camera.updateMatrixWorld()
    const aligned = projectedAlignmentError(
      camera,
      spatialAlignmentAnchors['parallax-bloom']!,
      { width: 1280, height: 720 },
    )

    camera.position.x += 1.5
    camera.lookAt(...spot.target)
    camera.updateMatrixWorld()
    const offset = projectedAlignmentError(
      camera,
      spatialAlignmentAnchors['parallax-bloom']!,
      { width: 1280, height: 720 },
    )

    expect(aligned).toBeLessThan(0.5)
    expect(offset).toBeGreaterThan(aligned + 1)
  })
})
