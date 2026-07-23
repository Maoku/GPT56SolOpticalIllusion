import { Html } from '@react-three/drei'
import { exhibitById } from '../../../exhibits/exhibitCatalog'
import { useMuseumStore } from '../../../state/useMuseumStore'
import { FOLDED_REVEAL_POINT } from '../../interaction/signatureExperience'
import { ExhibitLabel, FloorMarker, Structure } from '../../museum/shared'

const exhibit = exhibitById.get('folded-corridor')!
const CENTER_X = 4.5

export function FoldedCorridor() {
  const reveal = useMuseumStore((state) => state.activeExhibitId === exhibit.id && state.spatialStep > 0)
  const fragments = [
    { z: -14.1, width: 5.4, height: 3.7, color: '#f0dfcf' },
    { z: -15.05, width: 4.35, height: 3.15, color: '#bedbd9' },
    { z: -15.95, width: 3.3, height: 2.65, color: '#d8c9ef' },
    { z: -16.75, width: 2.4, height: 2.12, color: '#f2e8bd' },
  ]
  return (
    <group>
      {fragments.map((fragment, index) => {
        return (
          <group
            key={fragment.z}
            position={[CENTER_X, 0, fragment.z]}
          >
            <Structure position={[-fragment.width / 2, fragment.height / 2, 0]} scale={[0.12, fragment.height, 0.2 + index * 0.08]} color={fragment.color} />
            <Structure position={[fragment.width / 2, fragment.height / 2, 0]} scale={[0.12, fragment.height, 0.2 + index * 0.08]} color={fragment.color} />
            <Structure position={[0, fragment.height, 0]} scale={[fragment.width, 0.12, 0.2 + index * 0.08]} color={fragment.color} />
          </group>
        )
      })}
      {fragments.slice(0, -1).map((fragment, index) => (
        <mesh
          key={`broken-floor-${fragment.z}`}
          position={[CENTER_X, 0.035, (fragment.z + fragments[index + 1]!.z) / 2]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[1.55 - index * 0.2, Math.abs(fragment.z - fragments[index + 1]!.z) * 0.72]} />
          <meshStandardMaterial color={fragment.color} roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[CENTER_X, 1.05, -17.28]}>
        <planeGeometry args={[0.96, 1.55]} />
        <meshBasicMaterial color="#fffdf3" toneMapped={false} />
      </mesh>
      <FloorMarker position={[CENTER_X, 0.03, -10.4]} color={exhibit.accent} />
      <FloorMarker position={[FOLDED_REVEAL_POINT[0], 0.035, FOLDED_REVEAL_POINT[2]]} color="#7ef4d2" />
      <ExhibitLabel exhibit={exhibit} position={[CENTER_X, 4.15, -17]} />
      <pointLight position={[CENTER_X, 1.7, -16.2]} color="#fff3d6" intensity={8} distance={5} />
      {reveal && (
        <Html position={[7.55, 2.7, -14.45]} center transform distanceFactor={5.5}>
          <span className="ames-reveal-label">SIDE PATH · FOUR SEPARATE FRAMES</span>
        </Html>
      )}
    </group>
  )
}
