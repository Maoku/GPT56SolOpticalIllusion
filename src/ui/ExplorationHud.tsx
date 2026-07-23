import { useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { getMuseumMode } from '../app/museumMode'
import { zoneForPosition } from '../scene/focus'
import { useMuseumStore } from '../state/useMuseumStore'
import { Crosshair } from './Crosshair'
import { ExhibitPrompt } from './ExhibitPrompt'
import { MobileControls } from './MobileControls'
import { CompletionMessage, MuseumStatus } from './MuseumStatus'

export function SceneTelemetry() {
  const camera = useThree((state) => state.camera)
  const [zone, setZone] = useState(() => zoneForPosition(camera.position.x, camera.position.z, getMuseumMode()))
  const current = useRef(zone)
  useFrame(() => {
    const next = zoneForPosition(camera.position.x, camera.position.z, getMuseumMode())
    if (next !== current.current) { current.current = next; setZone(next) }
  })
  return (
    <Html fullscreen zIndexRange={[10, 10]} style={{ pointerEvents: 'none' }}>
      <span className="zone-readout">ZONE — {zone}</span>
    </Html>
  )
}

export function ExplorationHud() {
  const focused = useMuseumStore((state) => state.focusedExhibitId !== null)
  return (
    <>
      <Crosshair active={focused} />
      <ExhibitPrompt />
      <MuseumStatus />
      <CompletionMessage />
      <MobileControls />
    </>
  )
}
