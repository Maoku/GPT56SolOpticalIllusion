import type { CSSProperties } from 'react'
import { Html } from '@react-three/drei'
import { legacyExhibitCatalog } from '../exhibits/exhibitCatalog'
import { useMuseumStore } from '../state/useMuseumStore'

function Structure({ position, scale, color = '#172131' }: { position: [number, number, number]; scale: [number, number, number]; color?: string }) {
  return <mesh position={position} receiveShadow castShadow><boxGeometry args={scale} /><meshStandardMaterial color={color} roughness={0.82} /></mesh>
}

function ExhibitMarker({ exhibit }: { exhibit: (typeof legacyExhibitCatalog)[number] }) {
  const progress = useMuseumStore((state) => state.progress[exhibit.id] ?? 'unvisited')
  const stage = useMuseumStore((state) => state.stage)
  return (
    <group position={exhibit.position} rotation={exhibit.rotation}>
      <mesh castShadow>
        <boxGeometry args={[3.7, 2.65, 0.16]} />
        <meshStandardMaterial color="#0c1320" metalness={0.35} roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.12, 0.11]}>
        <planeGeometry args={[3.25, 1.85]} />
        <meshStandardMaterial color={exhibit.accent} emissive={exhibit.accent} emissiveIntensity={0.13} />
      </mesh>
      <mesh position={[-1.36, -1.07, 0.14]}>
        <circleGeometry args={[0.12, 16]} />
        <meshBasicMaterial color={progress === 'unvisited' ? '#52606c' : exhibit.accent} />
      </mesh>
      {stage === 'exploring' && (
        <Html position={[0, -1.58, 0.1]} center transform distanceFactor={7.2}>
          <div className="exhibit-label" style={{ '--exhibit-accent': exhibit.accent } as CSSProperties}>
            <span>{String(exhibit.number).padStart(2, '0')}</span>
            <strong>{exhibit.title}</strong>
          </div>
        </Html>
      )}
    </group>
  )
}

export function MuseumEnvironment() {
  return (
    <group>
      <Structure position={[0, -0.15, 0]} scale={[38, 0.3, 36]} color="#101724" />
      <Structure position={[0, 3.15, -18]} scale={[38, 6.3, 0.35]} />
      <Structure position={[0, 3.15, 18]} scale={[38, 6.3, 0.35]} />
      <Structure position={[-19, 3.15, 0]} scale={[0.35, 6.3, 36]} />
      <Structure position={[19, 3.15, 0]} scale={[0.35, 6.3, 36]} />
      <Structure position={[0, 6.25, 0]} scale={[38, 0.2, 36]} color="#0b111c" />
      <Structure position={[0, 1.25, 5.8]} scale={[4.6, 2.5, 0.45]} color="#26354a" />
      <Structure position={[0, 1.25, -5.9]} scale={[4.6, 2.5, 0.45]} color="#26354a" />

      <mesh position={[-9.5, 0.011, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[18.5, 34]} /><meshStandardMaterial color="#101f24" roughness={1} />
      </mesh>
      <mesh position={[9.5, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[18.5, 34]} /><meshStandardMaterial color="#201c24" roughness={1} />
      </mesh>
      <mesh position={[0, 0.014, -11.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[37, 12.5]} /><meshStandardMaterial color="#17182a" roughness={1} />
      </mesh>

      {legacyExhibitCatalog.map((exhibit) => <ExhibitMarker key={exhibit.id} exhibit={exhibit} />)}
    </group>
  )
}
