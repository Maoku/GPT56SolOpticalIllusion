import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import type { ExhibitType } from '../../exhibits/exhibitCatalog'
import { useMuseumStore, type MuseumSettings } from '../../state/useMuseumStore'
import { amesViewState } from './amesRoom'
import { checkerSceneStates } from './checkerShadow'
import {
  counterparallaxLayerX,
  counterparallaxMode,
  counterparallaxStaticViews,
} from './counterparallax'
import { chromaticPhaseForPosition, foldedViewState } from './signatureExperience'

type CameraPose = {
  position: [number, number, number]
  target: [number, number, number]
}

type SceneTestApi = {
  enterMuseum: () => void
  activate: (id: ExhibitType) => void
  setCamera: (pose: CameraPose) => void
  updateSettings: (settings: Partial<MuseumSettings>) => void
  snapshot: () => {
    stage: string
    activeExhibitId: ExhibitType | null
    focusedExhibitId: ExhibitType | null
    spatialStep: number
    alignmentError: number | null
    camera: [number, number, number]
    sceneParameters: Record<string, unknown>
  }
}

declare global {
  interface Window {
    __PARALLAX_E2E__?: SceneTestApi
  }
}

export function SceneTestBridge() {
  const camera = useThree((state) => state.camera)

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('e2e') !== '1') return

    const sceneParameters = () => {
      const state = useMuseumStore.getState()
      const position: [number, number, number] = [
        camera.position.x,
        camera.position.y,
        camera.position.z,
      ]
      switch (state.activeExhibitId) {
        case 'checker-shadow':
          return {
            ...checkerSceneStates[Math.min(state.spatialStep, checkerSceneStates.length - 1)]!,
            proceduralShadow: true,
            quality: state.settings.quality,
          }
        case 'ames-room':
          return { viewState: amesViewState(position), equalFigureScale: true }
        case 'parallax-bloom':
          return { alignmentError: state.alignmentError }
        case 'chromatic-echo-corridor':
          return { phase: chromaticPhaseForPosition(position) }
        case 'folded-corridor':
          return { viewState: foldedViewState(position), fixedFragments: true }
        case 'counterparallax-window': {
          const mode = counterparallaxMode(state.spatialStep)
          return {
            mode,
            layerOffset: counterparallaxLayerX(camera.position.x, mode),
            staticViews: state.settings.reducedMotion ? counterparallaxStaticViews(mode) : [],
          }
        }
        default:
          return {}
      }
    }

    const api: SceneTestApi = {
      enterMuseum: () => {
        const state = useMuseumStore.getState()
        state.enterMuseum()
        useMuseumStore.getState().dismissContextPrompts()
      },
      activate: (id) => useMuseumStore.getState().enterExhibit(id),
      setCamera: ({ position, target }) => {
        camera.position.set(...position)
        camera.lookAt(...target)
        camera.updateMatrixWorld()
        useMuseumStore.setState((state) => ({
          cameraRequest: {
            nonce: (state.cameraRequest?.nonce ?? 0) + 1,
            position,
            target,
          },
        }))
      },
      updateSettings: (settings) => useMuseumStore.getState().updateSettings(settings),
      snapshot: () => {
        const state = useMuseumStore.getState()
        return {
          stage: state.stage,
          activeExhibitId: state.activeExhibitId,
          focusedExhibitId: state.focusedExhibitId,
          spatialStep: state.spatialStep,
          alignmentError: state.alignmentError,
          camera: [camera.position.x, camera.position.y, camera.position.z],
          sceneParameters: sceneParameters(),
        }
      },
    }
    window.__PARALLAX_E2E__ = api
    return () => {
      if (window.__PARALLAX_E2E__ === api) delete window.__PARALLAX_E2E__
    }
  }, [camera])

  return null
}
