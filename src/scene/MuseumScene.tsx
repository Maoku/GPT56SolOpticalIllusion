import { MuseumEnvironment } from './MuseumEnvironment'
import { PlayerController } from './player/PlayerController'

export function MuseumScene() {
  return (
    <>
      <color attach="background" args={['#080c16']} />
      <fog attach="fog" args={['#080c16', 18, 50]} />
      <ambientLight intensity={0.48} />
      <hemisphereLight args={['#8ec7d8', '#171018', 0.85]} />
      <directionalLight position={[-7, 10, 7]} intensity={1.8} castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-11, 3.5, 5]} intensity={22} distance={17} color="#7ef4d2" />
      <pointLight position={[11, 3.5, 2]} intensity={20} distance={17} color="#f6a76e" />
      <pointLight position={[0, 3.5, -12]} intensity={24} distance={18} color="#9c8cff" />
      <MuseumEnvironment />
      <PlayerController />
    </>
  )
}
