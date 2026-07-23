import { Html } from '@react-three/drei'
import { exhibitById } from '../../exhibits/exhibitCatalog'
import { useMuseumStore } from '../../state/useMuseumStore'
import { ExhibitLabel, FloorMarker, Structure } from '../museum/shared'

const exhibit = exhibitById.get('chromatic-echo-corridor')!

export function SpatialChromaticCorridor() {
  const active = useMuseumStore((state) => state.activeExhibitId === exhibit.id)
  const step = useMuseumStore((state) => state.spatialStep)
  const reducedMotion = useMuseumStore((state) => state.settings.reducedMotion)
  const phases = [
    { id: 'ADAPT', z: -12.9, color: '#11bfd2', emissive: '#11bfd2' },
    { id: 'TRANSITION', z: -14.65, color: '#6d7279', emissive: '#1a1b1d' },
    { id: 'ECHO', z: -16.35, color: '#e9e6df', emissive: step >= 2 && active ? '#ff735f' : '#ddd8ce' },
  ]
  return (
    <group>
      {phases.map((phase, index) => {
        return (
          <group key={phase.id}>
            <Structure position={[-1.42, 1.55, phase.z]} scale={[0.12, 3.1, 1.62]} color={phase.color} emissive={phase.emissive} />
            <Structure position={[1.42, 1.55, phase.z]} scale={[0.12, 3.1, 1.62]} color={phase.color} emissive={phase.emissive} />
            <Structure position={[0, 3.08, phase.z]} scale={[2.96, 0.12, 1.62]} color="#101927" emissive={phase.emissive} />
            <mesh position={[0, 0.034, phase.z]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[2.72, 1.62]} />
              <meshStandardMaterial color={phase.color} emissive={phase.emissive} emissiveIntensity={index === step && active ? 0.5 : 0.16} />
            </mesh>
            <Html position={[1.25, 2.75, phase.z]} center transform distanceFactor={5.5}>
              <span className="chromatic-phase-label">{phase.id}</span>
            </Html>
          </group>
        )
      })}
      <mesh position={[0, 1.65, -17.08]}>
        <torusGeometry args={[0.18, 0.035, 12, 32]} />
        <meshBasicMaterial color={step >= 2 && active ? '#ff735f' : '#ffffff'} toneMapped={false} />
      </mesh>
      <mesh position={[0, 1.65, -17.12]}>
        <circleGeometry args={[0.035, 20]} />
        <meshBasicMaterial color="#111821" />
      </mesh>
      {reducedMotion && (
        <Html position={[0, 2.55, -16.95]} center transform distanceFactor={5.5}>
          <span className="chromatic-static-label">STATIC COMPARISON · WALK THROUGH</span>
        </Html>
      )}
      <FloorMarker position={[0, 0.03, -11.5]} color={exhibit.accent} />
      <ExhibitLabel exhibit={exhibit} position={[0, 3.75, -17.1]} />
      <pointLight position={[0, 2.2, -12.9]} color="#28e7f3" intensity={12} distance={4} />
      <pointLight position={[0, 2.2, -16.3]} color="#ff8b78" intensity={active && step >= 2 ? 11 : 2} distance={4} />
    </group>
  )
}
