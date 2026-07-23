import { SpatialAmesRoom } from '../exhibits/SpatialAmesRoom'
import { SpatialShadowRoom } from '../exhibits/SpatialShadowRoom'
import { Portal } from './shared'

export function ScaleLightRooms() {
  return (
    <group>
      <group position={[11.5, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <Portal position={[0, 0, 0]} color="#ffe08a" label="SCALE + LIGHT ROOMS" />
      </group>
      <SpatialShadowRoom />
      <SpatialAmesRoom />
    </group>
  )
}
