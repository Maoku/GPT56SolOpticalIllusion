import { FloorMarker, Portal } from './shared'

const colors = ['#ff68bd', '#ad92ff', '#76efd3']

export function ArrivalAtrium() {
  return (
    <group>
      <group position={[0, 4.15, 1.5]} scale={0.68}>
        {colors.map((color, layer) => (
          <group key={color} position={[0, (layer - 1) * 0.35, (layer - 1) * -0.55]} scale={1 + layer * 0.16}>
            {Array.from({ length: 10 }, (_, index) => {
              const angle = (index / 10) * Math.PI * 2
              return (
                <mesh
                  key={index}
                  position={[Math.cos(angle) * 1.08, Math.sin(angle) * 1.08, 0]}
                  rotation={[0, 0, angle - Math.PI / 2]}
                  scale={[0.42, 1.2, 0.13]}
                >
                  <sphereGeometry args={[0.8, 16, 9]} />
                  <meshPhysicalMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={0.9}
                    transparent
                    opacity={0.78}
                    transmission={0}
                    roughness={0.3}
                  />
                </mesh>
              )
            })}
          </group>
        ))}
      </group>
      <FloorMarker position={[0, 0.03, 7.6]} radius={0.78} />
      <group position={[0, 0, 7.4]}>
        <Portal position={[0, 0, 0]} color="#7ef4d2" label="ARRIVAL ATRIUM" />
      </group>
      <pointLight position={[0, 4.5, 2]} color="#ff68bd" intensity={65} distance={12} />
      <pointLight position={[0, 2.4, 5]} color="#76efd3" intensity={48} distance={9} />
    </group>
  )
}
