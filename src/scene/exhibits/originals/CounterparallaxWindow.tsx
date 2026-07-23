import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import type { Group } from 'three'
import { exhibitById } from '../../../exhibits/exhibitCatalog'
import { useMuseumStore } from '../../../state/useMuseumStore'
import { ExhibitLabel, FloorMarker, Structure } from '../../museum/shared'

const exhibit = exhibitById.get('counterparallax-window')!

export function CounterparallaxWindow() {
  const movingLayer = useRef<Group>(null)
  const camera = useThree((state) => state.camera)
  const reducedMotion = useMuseumStore((state) => state.settings.reducedMotion)
  const step = useMuseumStore((state) => state.activeExhibitId === exhibit.id ? state.spatialStep : 0)

  useFrame(() => {
    if (!movingLayer.current) return
    const parallax = reducedMotion ? (step > 0 ? 0.55 : -0.55) : (camera.position.x - 12) * 0.42
    movingLayer.current.position.x = Math.max(-1.25, Math.min(1.25, parallax))
  })

  return (
    <group>
      <Structure position={[9.75, 1.75, -17.35]} scale={[0.18, 3.5, 0.4]} color="#202a39" emissive="#ff58b2" />
      <Structure position={[14.25, 1.75, -17.35]} scale={[0.18, 3.5, 0.4]} color="#202a39" emissive="#62d6ff" />
      <Structure position={[12, 3.45, -17.35]} scale={[4.65, 0.18, 0.4]} color="#202a39" emissive="#62d6ff" />
      <Structure position={[12, 0.12, -17.35]} scale={[4.65, 0.18, 0.4]} color="#202a39" emissive="#ff58b2" />
      <group ref={movingLayer} position={[0, 0, 0]}>
        <Structure position={[11.1, 1.4, -17.75]} scale={[0.72, 2.25, 0.35]} color="#eee9df" />
        <Structure position={[13.05, 0.8, -17.9]} scale={[1.15, 1.25, 0.35]} color="#d8d3ca" />
        <mesh position={[12, 1.65, -18.12]}>
          <circleGeometry args={[0.58, 32]} />
          <meshStandardMaterial color="#f3eee5" emissive="#62d6ff" emissiveIntensity={0.18} />
        </mesh>
      </group>
      <FloorMarker position={[12, 0.03, -11.4]} color={exhibit.accent} />
      <ExhibitLabel exhibit={exhibit} position={[12, 4.1, -17]} />
      <pointLight position={[12, 2.1, -15.2]} color="#67d4ff" intensity={7} distance={6} />
    </group>
  )
}
