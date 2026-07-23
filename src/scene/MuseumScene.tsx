import { isV2Museum } from '../app/museumMode'
import { SpatialExhibitController } from './interaction/SpatialExhibitController'
import { MuseumEnvironment } from './MuseumEnvironment'
import { MuseumShell } from './museum/MuseumShell'
import { PlayerController } from './player/PlayerController'

export function MuseumScene() {
  const isV2 = isV2Museum()
  return (
    <>
      <color attach="background" args={[isV2 ? '#060b14' : '#080c16']} />
      <fog attach="fog" args={[isV2 ? '#060b14' : '#080c16', isV2 ? 22 : 18, 50]} />
      <ambientLight intensity={isV2 ? 0.72 : 0.48} />
      <hemisphereLight args={['#bfe9ef', '#241722', isV2 ? 1.15 : 0.85]} />
      <directionalLight position={[-7, 10, 7]} intensity={isV2 ? 3.2 : 1.8} castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-11, 3.5, 5]} intensity={isV2 ? 56 : 22} distance={18} color="#7ef4d2" />
      <pointLight position={[11, 3.5, 2]} intensity={isV2 ? 48 : 20} distance={18} color="#f6a76e" />
      <pointLight position={[0, 3.5, -12]} intensity={isV2 ? 62 : 24} distance={20} color="#9c8cff" />
      {isV2 ? <MuseumShell /> : <MuseumEnvironment />}
      {isV2 && <SpatialExhibitController />}
      <PlayerController />
    </>
  )
}
