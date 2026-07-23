import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { exhibitById } from '../../exhibits/exhibitCatalog'
import { useMuseumStore } from '../../state/useMuseumStore'
import { amesViewState } from './amesRoom'
import {
  chromaticPhaseForPosition,
  foldedViewState,
} from './signatureExperience'
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

    const cameraPosition: [number, number, number] = [
      camera.position.x,
      camera.position.y,
      camera.position.z,
    ]
    let nextStep: number | null = null
    if (exhibit.id === 'ames-room') {
      nextStep = amesViewState(cameraPosition) === 'reveal' ? 1 : 0
    } else if (exhibit.id === 'chromatic-echo-corridor') {
      nextStep = chromaticPhaseForPosition(cameraPosition)
    } else if (exhibit.id === 'folded-corridor') {
      nextStep = foldedViewState(cameraPosition) === 'reveal' ? 1 : 0
    }

    if (nextStep !== null) {
      if (nextStep !== state.spatialStep) state.setSpatialStep(nextStep)
      if (nextStep > 0) state.markInteracted(exhibit.id)
      if (
        (exhibit.id === 'ames-room' && nextStep === 1) ||
        (exhibit.id === 'chromatic-echo-corridor' && nextStep === 2) ||
        (exhibit.id === 'folded-corridor' && nextStep === 1)
      ) {
        state.markRevealed(exhibit.id)
      }
    }

    const anchors = spatialAlignmentAnchors[exhibit.id]
    const error = anchors
      ? projectedAlignmentError(camera, anchors, size)
      : (viewSpotDistance(
          [camera.position.x, camera.position.y, camera.position.z],
          spot,
        ) / spot.tolerance) * 24
    const rounded = Math.round(error * 10) / 10
    if (rounded !== state.alignmentError) state.setAlignmentError(rounded)
    if (exhibit.id === 'parallax-bloom' && rounded <= 12) {
      state.markInteracted(exhibit.id)
      state.markRevealed(exhibit.id)
    }
  })

  return null
}
