import { useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { zoneForPosition } from '../scene/focus'
import { useMuseumStore } from '../state/useMuseumStore'
import { Crosshair } from './Crosshair'
import { ExhibitPrompt } from './ExhibitPrompt'
import { MobileControls } from './MobileControls'

export function SceneTelemetry() {
  const camera = useThree((state) => state.camera)
  const [zone, setZone] = useState('ロビー')
  const current = useRef(zone)
  useFrame(() => {
    const next = zoneForPosition(camera.position.x, camera.position.z)
    if (next !== current.current) { current.current = next; setZone(next) }
  })
  return <Html fullscreen><span className="zone-readout">ZONE — {zone}</span></Html>
}

export function ExplorationHud() {
  const focused = useMuseumStore((state) => state.focusedExhibitId !== null)
  return (
    <>
      <Crosshair active={focused} />
      <ExhibitPrompt />
      <MobileControls />
    </>
  )
}
