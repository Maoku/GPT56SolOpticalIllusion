import { exhibitById } from '../../exhibits/exhibitCatalog'
import { ExhibitLabel, FloorMarker } from '../museum/shared'

const exhibit = exhibitById.get('parallax-bloom')!
const CENTER_X = -10
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
    <group position={[CENTER_X, height, depth]} scale={scale}>
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
  return (
    <group>
      <mesh position={[CENTER_X, 2.25, -17.58]}>
        <circleGeometry args={[2.25, 48]} />
        <meshStandardMaterial color="#090d17" roughness={0.88} />
      </mesh>
      {layerColors.map((color, index) => (
        <PetalLayer
          key={color}
          color={color}
          depth={layerDepths[index]!}
          height={layerHeights[index]!}
          scale={1 + index * 0.22}
        />
      ))}
      <mesh position={[CENTER_X, 0.028, -13.8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.06, 5.8]} />
        <meshBasicMaterial color="#ff78c8" toneMapped={false} />
      </mesh>
      <FloorMarker position={[CENTER_X, 0.025, -10.8]} color={exhibit.accent} />
      <ExhibitLabel exhibit={exhibit} position={[CENTER_X, 4.45, -17.2]} />
      <pointLight position={[CENTER_X, 2.4, -14.5]} color="#ff70c2" intensity={5} distance={8} />
    </group>
  )
}
