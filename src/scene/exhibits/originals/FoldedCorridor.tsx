import { exhibitById } from '../../../exhibits/exhibitCatalog'
import { useMuseumStore } from '../../../state/useMuseumStore'
import { ExhibitLabel, FloorMarker, Structure } from '../../museum/shared'

const exhibit = exhibitById.get('folded-corridor')!

export function FoldedCorridor() {
  const reveal = useMuseumStore((state) => state.activeExhibitId === exhibit.id && state.spatialStep > 0)
  const fragments = [
    { z: -14.7, width: 3.8, height: 3.5, offset: -0.06 },
    { z: -15.45, width: 3.15, height: 3.05, offset: 0.08 },
    { z: -16.15, width: 2.5, height: 2.58, offset: -0.04 },
    { z: -16.78, width: 1.85, height: 2.08, offset: 0.02 },
  ]
  return (
    <group>
      {fragments.map((fragment, index) => {
        const spread = reveal ? (index - 1.5) * 0.65 : 0
        return (
          <group
            key={fragment.z}
            position={[6 + fragment.offset + spread, 0, fragment.z]}
            rotation={[0, reveal ? (index - 1.5) * 0.18 : 0, 0]}
          >
            <Structure position={[-fragment.width / 2, fragment.height / 2, 0]} scale={[0.12, fragment.height, 0.2]} color="#e8e4dc" />
            <Structure position={[fragment.width / 2, fragment.height / 2, 0]} scale={[0.12, fragment.height, 0.2]} color="#e8e4dc" />
            <Structure position={[0, fragment.height, 0]} scale={[fragment.width, 0.12, 0.2]} color="#e8e4dc" />
          </group>
        )
      })}
      <mesh position={[6, 1.05, -17.25]}>
        <planeGeometry args={[0.82, 1.45]} />
        <meshBasicMaterial color="#fffdf3" toneMapped={false} />
      </mesh>
      <FloorMarker position={[6, 0.03, -11]} color={exhibit.accent} />
      <ExhibitLabel exhibit={exhibit} position={[6, 4.05, -17]} />
      <pointLight position={[6, 1.7, -16.2]} color="#fff3d6" intensity={8} distance={5} />
    </group>
  )
}
