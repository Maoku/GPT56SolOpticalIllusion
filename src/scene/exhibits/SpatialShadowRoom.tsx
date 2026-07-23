import { exhibitById } from '../../exhibits/exhibitCatalog'
import { useMuseumStore } from '../../state/useMuseumStore'
import { ExhibitLabel, FloorMarker, Structure } from '../museum/shared'

const exhibit = exhibitById.get('checker-shadow')!

export function SpatialShadowRoom() {
  const step = useMuseumStore((state) => state.activeExhibitId === exhibit.id ? state.spatialStep : 0)
  const neutral = step >= 2
  return (
    <group>
      <Structure position={[18.05, 1.7, 8]} scale={[0.35, 3.4, 7.2]} color="#d9d8d1" />
      {Array.from({ length: 24 }, (_, index) => {
        const row = Math.floor(index / 4)
        const column = index % 4
        const target = (row === 2 && column === 1) || (row === 3 && column === 2)
        const base = (row + column) % 2 === 0 ? '#c6c9c8' : '#3f454a'
        return (
          <mesh
            key={index}
            position={[15.2 + column * 0.72, 0.035, 5.9 + row * 0.72]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[0.7, 0.7]} />
            <meshStandardMaterial
              color={target ? '#747985' : base}
              emissive={neutral && target ? '#747985' : '#000000'}
              emissiveIntensity={neutral && target ? 0.4 : 0}
            />
          </mesh>
        )
      })}
      <mesh position={[16.6, 0.8, 7.25]} castShadow>
        <cylinderGeometry args={[0.45, 0.55, 1.6, 28]} />
        <meshStandardMaterial color="#b8c1c7" roughness={0.5} />
      </mesh>
      {!neutral && (
        <spotLight
          position={[14.7, 3.2, 4.8]}
          target-position={[16.6, 0, 7.25]}
          color={step === 1 ? '#ff69ba' : '#fff0cf'}
          intensity={24}
          distance={9}
          angle={0.48}
          penumbra={0.15}
          castShadow
        />
      )}
      {neutral && <pointLight position={[15.7, 2.5, 7.2]} intensity={10} distance={6} color="#ffffff" />}
      <FloorMarker position={[12.8, 0.03, 8]} color={exhibit.accent} />
      <ExhibitLabel exhibit={exhibit} position={[17.6, 3.85, 8]} />
    </group>
  )
}
