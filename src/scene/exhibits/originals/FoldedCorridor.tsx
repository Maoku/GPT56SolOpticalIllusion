import { Html } from '@react-three/drei'
import { exhibitById } from '../../../exhibits/exhibitCatalog'
import { useMuseumStore } from '../../../state/useMuseumStore'
import { FOLDED_REVEAL_POINT } from '../../interaction/signatureExperience'
import { ExhibitLabel, FloorMarker, Structure } from '../../museum/shared'

const exhibit = exhibitById.get('folded-corridor')!

export function FoldedCorridor() {
  const reveal = useMuseumStore((state) => state.activeExhibitId === exhibit.id && state.spatialStep > 0)
  const fragments = [
    { z: -14.7, width: 3.8, height: 3.5, color: '#f0dfcf' },
    { z: -15.45, width: 3.15, height: 3.05, color: '#bedbd9' },
    { z: -16.15, width: 2.5, height: 2.58, color: '#d8c9ef' },
    { z: -16.78, width: 1.85, height: 2.08, color: '#f2e8bd' },
  ]
  return (
    <group>
      {fragments.map((fragment, index) => {
        return (
          <group
            key={fragment.z}
            position={[6, 0, fragment.z]}
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
          position={[6, 0.035, (fragment.z + fragments[index + 1]!.z) / 2]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[1.2 - index * 0.18, Math.abs(fragment.z - fragments[index + 1]!.z) * 0.64]} />
          <meshStandardMaterial color={fragment.color} roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[6, 1.05, -17.25]}>
        <planeGeometry args={[0.82, 1.45]} />
        <meshBasicMaterial color="#fffdf3" toneMapped={false} />
      </mesh>
      <FloorMarker position={[6, 0.03, -11]} color={exhibit.accent} />
      <FloorMarker position={[FOLDED_REVEAL_POINT[0], 0.035, FOLDED_REVEAL_POINT[2]]} color="#7ef4d2" />
      <ExhibitLabel exhibit={exhibit} position={[6, 4.05, -17]} />
      <pointLight position={[6, 1.7, -16.2]} color="#fff3d6" intensity={8} distance={5} />
      {reveal && (
        <Html position={[8.1, 2.7, -14.6]} center transform distanceFactor={5.5}>
          <span className="ames-reveal-label">SIDE PATH · FOUR SEPARATE FRAMES</span>
        </Html>
      )}
    </group>
  )
}
