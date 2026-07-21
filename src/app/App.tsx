import { Canvas } from '@react-three/fiber'
import { MuseumScene } from '../scene/MuseumScene'

export function App() {
  return (
    <main className="app-shell">
      <Canvas
        aria-label="錯視ミュージアム 3D ビュー"
        camera={{ position: [0, 1.7, 6], fov: 60 }}
        dpr={[1, 1.75]}
      >
        <MuseumScene />
      </Canvas>
      <div className="phase-zero-card">
        <p className="eyebrow">OPTICAL ILLUSION MUSEUM</p>
        <h1>PARALLAX</h1>
        <p>3D Canvas とインターフェースの準備ができました。</p>
      </div>
    </main>
  )
}
