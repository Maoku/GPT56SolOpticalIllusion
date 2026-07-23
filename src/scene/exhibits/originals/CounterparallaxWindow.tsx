import { Html } from '@react-three/drei'
import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import type { Group } from 'three'
import { exhibitById } from '../../../exhibits/exhibitCatalog'
import { useMuseumStore } from '../../../state/useMuseumStore'
import {
  counterparallaxLayerX,
  counterparallaxMode,
  counterparallaxStaticViews,
} from '../../interaction/counterparallax'
import { ExhibitLabel, FloorMarker, Structure } from '../../museum/shared'

const exhibit = exhibitById.get('counterparallax-window')!

function DepthRoom({ compact = false }: { compact?: boolean }) {
  const scale = compact ? 0.42 : 1
  return (
    <group scale={scale}>
      <Structure position={[10.65, 1.4, -18.9]} scale={[0.78, 2.25, 0.35]} color="#eee9df" />
      <Structure position={[13.45, 0.8, -20.2]} scale={[1.2, 1.25, 0.35]} color="#d8d3ca" />
      <Structure position={[12, 1.65, -22.15]} scale={[5.25, 3.1, 0.22]} color="#183044" emissive="#174c69" />
      <Structure position={[10.35, 1.55, -20.1]} scale={[0.18, 3.05, 0.18]} color="#dce6ea" />
      <Structure position={[13.65, 1.55, -20.1]} scale={[0.18, 3.05, 0.18]} color="#dce6ea" />
      <mesh position={[12, 1.78, -21.86]}>
        <circleGeometry args={[0.58, 32]} />
        <meshStandardMaterial color="#f3eee5" emissive="#62d6ff" emissiveIntensity={0.3} />
      </mesh>
      <Structure position={[12, 1.1, -21.8]} scale={[4, 0.05, 0.08]} color="#72d9ff" emissive="#72d9ff" />
    </group>
  )
}

function FloorGrid() {
  return (
    <group>
      <mesh position={[12, 0.16, -19.7]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[5.2, 5.6]} />
        <meshStandardMaterial color="#18232e" roughness={0.9} />
      </mesh>
      {Array.from({ length: 7 }, (_, index) => (
        <Structure
          key={`cross-${index}`}
          position={[12, 0.175, -17.6 - index * 0.7]}
          scale={[5.15, 0.025, 0.025]}
          color="#5b7685"
          emissive="#274352"
        />
      ))}
      {Array.from({ length: 7 }, (_, index) => (
        <Structure
          key={`depth-${index}`}
          position={[9.45 + index * 0.85, 0.178, -19.7]}
          scale={[0.025, 0.025, 5.6]}
          color="#5b7685"
          emissive="#274352"
        />
      ))}
    </group>
  )
}

export function CounterparallaxWindow() {
  const movingLayer = useRef<Group>(null)
  const camera = useThree((state) => state.camera)
  const reducedMotion = useMuseumStore((state) => state.settings.reducedMotion)
  const step = useMuseumStore((state) => state.activeExhibitId === exhibit.id ? state.spatialStep : 0)
  const mode = counterparallaxMode(step)
  const staticViews = counterparallaxStaticViews(mode)

  useFrame(() => {
    if (!movingLayer.current) return
    movingLayer.current.position.x = reducedMotion
      ? 0
      : counterparallaxLayerX(camera.position.x, mode)
  })

  return (
    <group>
      <FloorGrid />
      <Structure position={[9.2, 1.7, -19.75]} scale={[0.22, 3.4, 4.75]} color="#121b27" />
      <Structure position={[14.8, 1.7, -19.75]} scale={[0.22, 3.4, 4.75]} color="#121b27" />
      <Structure position={[12, 3.38, -19.75]} scale={[5.8, 0.22, 4.75]} color="#121b27" />
      <Structure position={[9.35, 1.75, -17.35]} scale={[0.18, 3.5, 0.4]} color="#202a39" emissive="#ff58b2" />
      <Structure position={[14.65, 1.75, -17.35]} scale={[0.18, 3.5, 0.4]} color="#202a39" emissive="#62d6ff" />
      <Structure position={[12, 3.45, -17.35]} scale={[5.48, 0.18, 0.4]} color="#202a39" emissive="#62d6ff" />
      <Structure position={[12, 0.12, -17.35]} scale={[5.48, 0.18, 0.4]} color="#202a39" emissive="#ff58b2" />
      <group ref={movingLayer} position={[0, 0, 0]}>
        <DepthRoom />
      </group>
      {reducedMotion && staticViews.map((view, index) => (
        <group
          key={view.cameraOffset}
          position={[
            (index === 0 ? 7.2 : 16.8) + view.layerOffset * 0.28,
            0.48,
            -8.9,
          ]}
        >
          <DepthRoom compact />
          <Html position={[5.05, 1.7, -9.3]} center transform distanceFactor={5}>
            <span className="counter-view-label">{index === 0 ? 'LEFT VIEW' : 'RIGHT VIEW'}</span>
          </Html>
        </group>
      ))}
      <FloorMarker position={[12, 0.03, -11.4]} color={exhibit.accent} />
      <ExhibitLabel exhibit={exhibit} position={[12, 4.1, -17]} />
      <pointLight position={[12, 2.1, -15.2]} color="#67d4ff" intensity={7} distance={6} />
      <Html position={[12, 0.16, -11.4]} center transform distanceFactor={5}>
        <span className="spatial-action-label">E · {mode === 'normal' ? 'NORMAL' : 'REVERSE'}</span>
      </Html>
    </group>
  )
}
