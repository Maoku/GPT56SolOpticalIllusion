import { exhibitById } from '../../exhibits/exhibitCatalog'
import { useMuseumStore } from '../../state/useMuseumStore'
import { ExhibitLabel, FloorMarker } from '../museum/shared'

const exhibit = exhibitById.get('parallax-bloom')!
const layerColors = ['#78f3d6', '#a891ff', '#ff69ba']
const layerDepths = [-15.8, -16.6, -17.4]
const layerHeights = [2.13, 2.21, 2.29]

function PetalLayer({
  color,
  depth,
  height,
  scale,
}: {
  color: string
  depth: number
  height: number
  scale: number
}) {
  return (
    <group position={[-6, height, depth]} scale={scale}>
      {Array.from({ length: 14 }, (_, index) => {
        const angle = (index / 14) * Math.PI * 2
        return (
          <mesh
            key={index}
            position={[Math.cos(angle) * 0.72, Math.sin(angle) * 0.72, 0]}
            rotation={[0, 0, angle - Math.PI / 2]}
            scale={[0.38, 0.92, 0.12]}
            castShadow
          >
            <sphereGeometry args={[0.72, 18, 10]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.48}
              roughness={0.36}
            />
          </mesh>
        )
      })}
      <mesh>
        <sphereGeometry args={[0.34, 20, 12]} />
        <meshStandardMaterial color="#fff3a8" emissive="#ffd86a" emissiveIntensity={1.5} />
      </mesh>
    </group>
  )
}

export function SpatialParallaxBloom() {
  const step = useMuseumStore((state) => state.spatialStep)
  const active = useMuseumStore((state) => state.activeExhibitId === exhibit.id)
  const spread = active && step > 0 ? 1.7 : 1
  return (
    <group>
      {layerColors.map((color, index) => (
        <PetalLayer
          key={color}
          color={color}
          depth={layerDepths[index]! + (index - 1) * 0.32 * (spread - 1)}
          height={layerHeights[index]! + (index - 1) * 0.26 * (spread - 1)}
          scale={1 + index * 0.22}
        />
      ))}
      <FloorMarker position={[-6, 0.025, -10.8]} color={exhibit.accent} />
      <ExhibitLabel exhibit={exhibit} position={[-6, 4.45, -17.2]} />
      <pointLight position={[-6, 2.4, -14.5]} color="#ff70c2" intensity={5} distance={8} />
    </group>
  )
}
