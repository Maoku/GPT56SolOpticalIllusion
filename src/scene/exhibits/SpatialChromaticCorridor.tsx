import { exhibitById } from '../../exhibits/exhibitCatalog'
import { useMuseumStore } from '../../state/useMuseumStore'
import { ExhibitLabel, FloorMarker, Structure } from '../museum/shared'

const exhibit = exhibitById.get('chromatic-echo-corridor')!

export function SpatialChromaticCorridor() {
  const active = useMuseumStore((state) => state.activeExhibitId === exhibit.id)
  const step = useMuseumStore((state) => state.spatialStep)
  const phases = [
    { color: '#12bdd1', emissive: '#12bdd1' },
    { color: '#6d7279', emissive: '#1a1b1d' },
    { color: '#ece8df', emissive: step >= 2 && active ? '#ff806f' : '#f2e8d8' },
  ]
  return (
    <group>
      {phases.map((phase, index) => {
        const x = -1.8 + index * 1.8
        return (
          <group key={phase.color}>
            <Structure position={[x, 1.55, -17.45]} scale={[1.68, 3.1, 0.45]} color={phase.color} emissive={phase.emissive} />
            <Structure position={[x - 0.78, 1.55, -15.9]} scale={[0.1, 3.1, 3]} color="#111927" emissive={phase.emissive} />
            <Structure position={[x + 0.78, 1.55, -15.9]} scale={[0.1, 3.1, 3]} color="#111927" emissive={phase.emissive} />
            <mesh position={[x, 0.025, -15.9]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[1.55, 3]} />
              <meshStandardMaterial color={phase.color} emissive={phase.emissive} emissiveIntensity={0.22} />
            </mesh>
          </group>
        )
      })}
      <FloorMarker position={[0, 0.03, -11.5]} color={exhibit.accent} />
      <ExhibitLabel exhibit={exhibit} position={[0, 3.75, -17.1]} />
      <pointLight position={[-1.8, 2.2, -15]} color="#28e7f3" intensity={9} distance={5} />
      <pointLight position={[1.8, 2.2, -15]} color="#ff8b78" intensity={active && step >= 2 ? 10 : 3} distance={5} />
    </group>
  )
}
