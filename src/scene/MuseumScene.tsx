export function MuseumScene() {
  return (
    <>
      <color attach="background" args={['#080c16']} />
      <ambientLight intensity={0.8} />
      <pointLight position={[2, 4, 3]} intensity={18} color="#7ef4d2" />
      <mesh rotation={[0.35, 0.45, 0]}>
        <icosahedronGeometry args={[1.25, 1]} />
        <meshStandardMaterial color="#163e4c" wireframe />
      </mesh>
    </>
  )
}
