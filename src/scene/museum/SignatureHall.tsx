import { SpatialChromaticCorridor } from '../exhibits/SpatialChromaticCorridor'
import { SpatialParallaxBloom } from '../exhibits/SpatialParallaxBloom'
import { CounterparallaxWindow } from '../exhibits/originals/CounterparallaxWindow'
import { FoldedCorridor } from '../exhibits/originals/FoldedCorridor'
import { Portal } from './shared'

export function SignatureHall() {
  return (
    <group>
      <group position={[0, 0, -11.1]}>
        <Portal position={[0, 0, 0]} color="#ff68bd" label="PARALLAX SIGNATURE HALL" />
      </group>
      <SpatialParallaxBloom />
      <SpatialChromaticCorridor />
      <FoldedCorridor />
      <CounterparallaxWindow />
      <mesh position={[3, 0.026, -11.72]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[17.5, 0.035]} />
        <meshBasicMaterial color="#875b8d" toneMapped={false} />
      </mesh>
      <pointLight position={[-6, 3.6, -13.2]} color="#ff78c8" intensity={5} distance={7} />
      <pointLight position={[6, 3.6, -13.2]} color="#72f0d0" intensity={5} distance={7} />
    </group>
  )
}
