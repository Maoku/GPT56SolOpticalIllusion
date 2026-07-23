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
    </group>
  )
}
