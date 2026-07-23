import { exhibitCatalog } from '../../exhibits/exhibitCatalog'
import { ExhibitLabel, Portal } from './shared'

const classics = exhibitCatalog.filter((exhibit) => exhibit.venue === 'classics')

function Miniature({ index, accent }: { index: number; accent: string }) {
  if (index === 0) {
    return (
      <group>
        <mesh position={[-0.45, 0, 0.08]} rotation={[0, 0, 0.7]}><boxGeometry args={[0.85, 0.04, 0.04]} /><meshBasicMaterial color={accent} /></mesh>
        <mesh position={[0.45, 0, 0.08]} rotation={[0, 0, -0.7]}><boxGeometry args={[0.85, 0.04, 0.04]} /><meshBasicMaterial color={accent} /></mesh>
      </group>
    )
  }
  if (index === 1) {
    return (
      <group>
        {[-0.5, 0.5].map((x) => <mesh key={x} position={[x, 0, 0.08]} rotation={[0, 0, x * 0.7]}><boxGeometry args={[0.05, 1.2, 0.04]} /><meshBasicMaterial color={accent} /></mesh>)}
        <mesh position={[0, 0.25, 0.1]}><boxGeometry args={[0.8, 0.06, 0.04]} /><meshBasicMaterial color="#f4f1e9" /></mesh>
      </group>
    )
  }
  if (index === 2) {
    return (
      <group>
        <mesh position={[-0.42, 0, 0.08]}><circleGeometry args={[0.22, 24]} /><meshBasicMaterial color={accent} /></mesh>
        <mesh position={[0.42, 0, 0.08]}><circleGeometry args={[0.22, 24]} /><meshBasicMaterial color={accent} /></mesh>
        {Array.from({ length: 8 }, (_, dot) => {
          const angle = dot / 8 * Math.PI * 2
          return <mesh key={dot} position={[0.42 + Math.cos(angle) * 0.48, Math.sin(angle) * 0.48, 0.07]}><circleGeometry args={[0.08, 14]} /><meshBasicMaterial color="#8894a2" /></mesh>
        })}
      </group>
    )
  }
  return (
    <group rotation={[0, 0, index * 0.08]}>
      {Array.from({ length: 5 }, (_, row) => (
        <mesh key={row} position={[row % 2 ? 0.18 : -0.18, (row - 2) * 0.23, 0.08]}>
          <boxGeometry args={[1.25, 0.12, 0.04]} />
          <meshBasicMaterial color={row % 2 ? accent : '#eef0eb'} />
        </mesh>
      ))}
    </group>
  )
}

export function ClassicsLab() {
  return (
    <group>
      <group position={[0, 0, 11.2]} rotation={[0, Math.PI, 0]}>
        <Portal position={[0, 0, 0]} color="#7ef4d2" label="CLASSICS LAB" />
      </group>
      {classics.map((exhibit, index) => (
        <group key={exhibit.id} position={exhibit.position} rotation={exhibit.rotation}>
          <mesh castShadow>
            <boxGeometry args={[4.25, 2.8, 0.18]} />
            <meshStandardMaterial color="#0d1420" metalness={0.35} roughness={0.42} />
          </mesh>
          <mesh position={[0, 0.08, 0.12]}>
            <planeGeometry args={[3.8, 2.2]} />
            <meshStandardMaterial color="#f2eee5" emissive={exhibit.accent} emissiveIntensity={0.04} />
          </mesh>
          <Miniature index={index} accent={exhibit.accent} />
          <ExhibitLabel exhibit={exhibit} position={[0, -1.72, 0.12]} />
          <pointLight position={[0, 0.4, 1.2]} color={exhibit.accent} intensity={2.8} distance={4} />
        </group>
      ))}
    </group>
  )
}
