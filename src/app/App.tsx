import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { MuseumScene } from '../scene/MuseumScene'
import { isWebGL2Available } from '../lib/webgl'
import { useMuseumStore } from '../state/useMuseumStore'
import { ErrorBoundary } from '../ui/ErrorBoundary'
import { LoadingScreen } from '../ui/LoadingScreen'
import { SettingsPanel } from '../ui/SettingsPanel'
import { StartScreen } from '../ui/StartScreen'
import { WebGLFallback } from '../ui/WebGLFallback'
import { ExplorationHud } from '../ui/ExplorationHud'
import { ExhibitExperience } from '../exhibits/ExhibitExperience'
import { HintPanel } from '../ui/HintPanel'
import { MuseumMap } from '../ui/MuseumMap'
import { TutorialOverlay } from '../ui/TutorialOverlay'
import { SpatialExhibitHud } from '../ui/SpatialExhibitHud'
import { PerceptionPassport } from '../ui/PerceptionPassport'
import { ContextPrompts } from '../ui/ContextPrompts'

type AppProps = { webGLAvailable?: boolean; sceneEnabled?: boolean }

export function App({ sceneEnabled = true, webGLAvailable = sceneEnabled ? isWebGL2Available() : true }: AppProps) {
  const stage = useMuseumStore((state) => state.stage)
  const overlay = useMuseumStore((state) => state.overlay)
  const quality = useMuseumStore((state) => state.settings.quality)

  if (!webGLAvailable) return <WebGLFallback />

  return (
    <ErrorBoundary>
      <main className="app-shell">
        {sceneEnabled ? (
          <Suspense fallback={<LoadingScreen />}>
            <Canvas
              aria-label="錯視ミュージアム 3D ビュー"
              camera={{ position: [0, 1.7, 8], fov: 58, near: 0.1, far: 90 }}
              dpr={quality === 'low' ? [1, 1.2] : [1, 1.75]}
              shadows={quality === 'high'}
              gl={{ antialias: quality === 'high', powerPreference: 'high-performance' }}
            >
              <MuseumScene />
            </Canvas>
          </Suspense>
        ) : <div className="scene-placeholder" aria-hidden="true" />}
        {stage === 'title' && <StartScreen />}
        {stage === 'exploring' && overlay === 'none' && <ExplorationHud />}
        {stage === 'exhibit' && <ExhibitExperience />}
        {stage === 'spatial-exhibit' && overlay === 'none' && <SpatialExhibitHud />}
        {stage === 'exploring' && <ContextPrompts />}
        {stage !== 'title' && (
          <button
            className="museum-menu-button"
            aria-label="設定を開く"
            onClick={() => useMuseumStore.getState().openOverlay('settings')}
          >
            <span aria-hidden="true">☰</span> MENU
          </button>
        )}
        {overlay === 'settings' && <SettingsPanel />}
        {overlay === 'hint' && <HintPanel />}
        {overlay === 'map' && <MuseumMap />}
        {overlay === 'passport' && <PerceptionPassport />}
        {overlay === 'tutorial' && <TutorialOverlay />}
      </main>
    </ErrorBoundary>
  )
}
