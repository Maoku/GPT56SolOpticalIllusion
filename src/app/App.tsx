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
import { ExplorationHud, SceneTelemetry } from '../ui/ExplorationHud'

type AppProps = { webGLAvailable?: boolean }

export function App({ webGLAvailable = isWebGL2Available() }: AppProps) {
  const stage = useMuseumStore((state) => state.stage)
  const overlay = useMuseumStore((state) => state.overlay)

  if (!webGLAvailable) return <WebGLFallback />

  return (
    <ErrorBoundary>
      <main className="app-shell">
        <Suspense fallback={<LoadingScreen />}>
          <Canvas
            aria-label="錯視ミュージアム 3D ビュー"
            camera={{ position: [0, 1.7, 8], fov: 58, near: 0.1, far: 90 }}
            dpr={[1, 1.75]}
            shadows
          >
            <MuseumScene />
            {stage === 'exploring' && <SceneTelemetry />}
          </Canvas>
        </Suspense>
        {stage === 'title' && <StartScreen />}
        {stage === 'exploring' && overlay === 'none' && <ExplorationHud />}
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
      </main>
    </ErrorBoundary>
  )
}
