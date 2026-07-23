import { exhibitById } from '../../exhibits/exhibitCatalog'
import { useMuseumStore } from '../../state/useMuseumStore'
import { ExhibitLabel, FloorMarker } from '../museum/shared'

const exhibit = exhibitById.get('ames-room')!

function Figure({ position, scale }: { position: [number, number, number]; scale: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 1.05, 0]}>
        <sphereGeometry args={[0.22, 18, 12]} />
        <meshStandardMaterial color="#11131a" />
      </mesh>
      <mesh position={[0, 0.45, 0]}>
        <capsuleGeometry args={[0.24, 0.72, 8, 16]} />
        <meshStandardMaterial color="#161924" />
      </mesh>
    </group>
  )
}

export function SpatialAmesRoom() {
  const reveal = useMuseumStore((state) => state.activeExhibitId === exhibit.id && state.spatialStep > 0)
  return (
    <group>
      <mesh position={[18, 1.55, -9]} rotation={[0, -Math.PI / 2, 0]}>
        <boxGeometry args={[5.4, 3.2, 0.18]} />
        <meshStandardMaterial color="#f3eee5" roughness={0.9} />
      </mesh>
      <mesh position={[16.5, 0.02, -9]} rotation={[-Math.PI / 2, 0, reveal ? -0.15 : 0]}>
        <planeGeometry args={[3.1, 5.2]} />
        <meshStandardMaterial color="#e8e3da" />
      </mesh>
      <mesh position={[16.5, 3.1, -9]} rotation={[Math.PI / 2, 0, reveal ? 0.12 : 0]}>
        <planeGeometry args={[3.1, 5.2]} />
        <meshStandardMaterial color="#d9d4cc" />
      </mesh>
      <Figure position={[16.45, 0.08, -10.75]} scale={1.35} />
      <Figure position={[17.2, 0.08, -7.4]} scale={0.58} />
      <FloorMarker position={[12.7, 0.03, -9]} color={exhibit.accent} />
      <ExhibitLabel exhibit={exhibit} position={[17.7, 3.85, -9]} />
      <pointLight position={[15.5, 2.5, -9]} color="#ffd9d9" intensity={10} distance={7} />
    </group>
  )
}
