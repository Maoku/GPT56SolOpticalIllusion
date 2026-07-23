import type { CSSProperties, ReactNode } from 'react'
import { Html } from '@react-three/drei'
import type { ExhibitDefinition } from '../../exhibits/exhibitCatalog'
import { useMuseumStore } from '../../state/useMuseumStore'

export function Structure({
  position,
  scale,
  color = '#121b2a',
  emissive = '#000000',
}: {
  position: [number, number, number]
  scale: [number, number, number]
  color?: string
  emissive?: string
}) {
  return (
    <mesh position={position} receiveShadow castShadow>
      <boxGeometry args={scale} />
      <meshStandardMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={0.18}
        roughness={0.78}
        metalness={0.18}
      />
    </mesh>
  )
}

export function FloorMarker({
  position,
  color = '#7ef4d2',
  radius = 0.58,
}: {
  position: [number, number, number]
  color?: string
  radius?: number
}) {
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 0.72, radius, 36]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.055, 18]} />
        <meshBasicMaterial color="#f5fffb" toneMapped={false} />
      </mesh>
      <pointLight color={color} intensity={2.8} distance={2.6} position={[0, 0.2, 0]} />
    </group>
  )
}

export function ExhibitLabel({
  exhibit,
  position = [0, 2.15, 0],
  children,
}: {
  exhibit: ExhibitDefinition
  position?: [number, number, number]
  children?: ReactNode
}) {
  const stage = useMuseumStore((state) => state.stage)
  if (stage !== 'exploring' && stage !== 'spatial-exhibit') return null
  return (
    <Html position={position} center transform distanceFactor={7.5}>
      <div
        className="v2-exhibit-label"
        style={{ '--exhibit-accent': exhibit.accent } as CSSProperties}
      >
        <span>{String(exhibit.number).padStart(2, '0')}</span>
        <div>
          <strong>{exhibit.subtitle}</strong>
          <small>{children ?? exhibit.title}</small>
        </div>
      </div>
    </Html>
  )
}

export function Portal({
  position,
  color,
  label,
}: {
  position: [number, number, number]
  color: string
  label: string
}) {
  return (
    <group position={position}>
      <Structure position={[-2.15, 1.8, 0]} scale={[0.14, 3.6, 0.3]} color="#172132" emissive={color} />
      <Structure position={[2.15, 1.8, 0]} scale={[0.14, 3.6, 0.3]} color="#172132" emissive={color} />
      <Structure position={[0, 3.55, 0]} scale={[4.45, 0.14, 0.3]} color="#172132" emissive={color} />
      <Html position={[0, 3.15, 0.12]} center transform distanceFactor={8}>
        <span className="v2-portal-label" style={{ color }}>{label}</span>
      </Html>
    </group>
  )
}
