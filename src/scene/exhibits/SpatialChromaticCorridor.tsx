import { Html } from '@react-three/drei'
import { exhibitById } from '../../exhibits/exhibitCatalog'
import { useMuseumStore } from '../../state/useMuseumStore'
import { chromaticLightingForPhase } from '../interaction/signatureExperience'
import { ExhibitLabel, FloorMarker, Structure } from '../museum/shared'

const exhibit = exhibitById.get('chromatic-echo-corridor')!
const CENTER_X = -2.5

export function SpatialChromaticCorridor() {
  const active = useMuseumStore((state) => state.activeExhibitId === exhibit.id)
  const step = useMuseumStore((state) => state.spatialStep)
  const reducedMotion = useMuseumStore((state) => state.settings.reducedMotion)
  const lighting = chromaticLightingForPhase(active, step)
  const phases = [
    { id: 'ADAPT', z: -13.05, color: '#0da9b9', emissive: active && step === 0 ? '#0da9b9' : '#17383d' },
    { id: 'TRANSITION', z: -14.82, color: '#686d73', emissive: '#17191c' },
    { id: 'ECHO', z: -16.48, color: lighting.echoSurfaceColor, emissive: '#d8d5ce' },
  ]
  return (
    <group position={[CENTER_X, 0, 0]}>
      <Structure position={[-1.5, 1.58, -14.8]} scale={[0.16, 3.16, 5.55]} color="#111923" />
      <Structure position={[1.5, 1.58, -14.8]} scale={[0.16, 3.16, 5.55]} color="#111923" />
      <Structure position={[0, 3.12, -14.8]} scale={[3.16, 0.16, 5.55]} color="#0d1520" />
      <Structure position={[0, 1.58, -17.48]} scale={[3.16, 3.16, 0.16]} color="#e9e6df" />
      {phases.map((phase, index) => {
        return (
          <group key={phase.id}>
            <Structure position={[-1.39, 1.55, phase.z]} scale={[0.08, 2.82, 1.5]} color={phase.color} emissive={phase.emissive} />
            <Structure position={[1.39, 1.55, phase.z]} scale={[0.08, 2.82, 1.5]} color={phase.color} emissive={phase.emissive} />
            <mesh position={[0, 0.034, phase.z]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[2.72, 1.5]} />
              <meshStandardMaterial
                color={phase.color}
                emissive={phase.emissive}
                emissiveIntensity={index === step && active ? 0.28 : 0.04}
              />
            </mesh>
            {active && index === step && (
              <Html position={[1.24, 2.62, phase.z]} center transform distanceFactor={5.5}>
                <span className="chromatic-phase-label">{phase.id}</span>
              </Html>
            )}
          </group>
        )
      })}
      <group>
        <Structure position={[-1.3, 1.55, -12.12]} scale={[0.42, 3.1, 0.14]} color="#0b121c" />
        <Structure position={[1.3, 1.55, -12.12]} scale={[0.42, 3.1, 0.14]} color="#0b121c" />
        <Structure position={[0, 2.95, -12.12]} scale={[2.18, 0.3, 0.14]} color="#0b121c" />
      </group>
      <group>
        <Structure
          position={[-0.53, 1.55, -13.92]}
          scale={[1.95, 3.1, 0.14]}
          color="#0da9b9"
          emissive={active && step === 0 ? '#0da9b9' : '#17383d'}
        />
        <Structure position={[1.33, 1.55, -13.92]} scale={[0.35, 3.1, 0.14]} color="#0b121c" />
        <Structure position={[0.8, 2.95, -13.92]} scale={[0.7, 0.3, 0.14]} color="#0b121c" />
      </group>
      <group>
        <Structure position={[-1.33, 1.55, -15.72]} scale={[0.35, 3.1, 0.14]} color="#0b121c" />
        <Structure position={[0.53, 1.55, -15.72]} scale={[1.95, 3.1, 0.14]} color="#686d73" />
        <Structure position={[-0.8, 2.95, -15.72]} scale={[0.7, 0.3, 0.14]} color="#0b121c" />
      </group>
      <mesh position={[0, 1.65, -17.37]}>
        <torusGeometry args={[0.18, 0.035, 12, 32]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
      <mesh position={[0, 1.65, -17.4]}>
        <circleGeometry args={[0.035, 20]} />
        <meshBasicMaterial color="#111821" />
      </mesh>
      {reducedMotion && (
        <Html position={[0, 2.52, -17.25]} center transform distanceFactor={5.5}>
          <span className="chromatic-static-label">STATIC COMPARISON · WALK THROUGH</span>
        </Html>
      )}
      <FloorMarker position={[0, 0.03, -11.5]} color={exhibit.accent} />
      <ExhibitLabel exhibit={exhibit} position={[0, 3.72, -17.15]} />
      <pointLight
        position={[0, 2.25, -16.48]}
        color={lighting.resultColor}
        intensity={lighting.resultIntensity}
        distance={2.8}
      />
    </group>
  )
}
