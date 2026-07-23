import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { exhibitById } from '../../exhibits/exhibitCatalog'
import { useMuseumStore } from '../../state/useMuseumStore'
import {
  projectedAlignmentError,
  spatialAlignmentAnchors,
  viewSpotDistance,
} from './alignment'

export function SpatialExhibitController() {
  const camera = useThree((state) => state.camera)
  const size = useThree((state) => state.size)
  const elapsed = useRef(0)

  useFrame((_, delta) => {
    elapsed.current += delta
    if (elapsed.current < 0.08) return
    elapsed.current = 0

    const state = useMuseumStore.getState()
    if (state.stage !== 'spatial-exhibit' || !state.activeExhibitId) return
    const exhibit = exhibitById.get(state.activeExhibitId)
    const spot = exhibit?.viewSpots?.[0]
    if (!exhibit || !spot) return

    const anchors = spatialAlignmentAnchors[exhibit.id]
    const error = anchors
      ? projectedAlignmentError(camera, anchors, size)
      : (viewSpotDistance(
          [camera.position.x, camera.position.y, camera.position.z],
          spot,
        ) / spot.tolerance) * 24
    const rounded = Math.round(error * 10) / 10
    if (rounded !== state.alignmentError) state.setAlignmentError(rounded)
  })

  return null
}
