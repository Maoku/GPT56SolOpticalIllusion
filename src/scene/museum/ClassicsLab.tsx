import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'
import {
  exhibitCatalog,
  type ExhibitDefinition,
} from '../../exhibits/exhibitCatalog'
import { useMuseumStore } from '../../state/useMuseumStore'
import { ExhibitLabel, Portal } from './shared'

const classics = exhibitCatalog.filter((exhibit) => exhibit.venue === 'classics')

function Segment({
  position,
  length,
  rotation = 0,
  color = '#15191f',
  thickness = 0.045,
}: {
  position: [number, number, number]
  length: number
  rotation?: number
  color?: string
  thickness?: number
}) {
  return (
    <mesh position={position} rotation={[0, 0, rotation]}>
      <boxGeometry args={[length, thickness, 0.035]} />
      <meshBasicMaterial color={color} />
    </mesh>
  )
}

function SegmentBetween({
  from,
  to,
  color,
}: {
  from: [number, number]
  to: [number, number]
  color: string
}) {
  const dx = to[0] - from[0]
  const dy = to[1] - from[1]
  return (
    <Segment
      position={[(from[0] + to[0]) / 2, (from[1] + to[1]) / 2, 0.19]}
      length={Math.hypot(dx, dy)}
      rotation={Math.atan2(dy, dx)}
      color={color}
    />
  )
}

function MullerLyerLive({ step }: { step: number }) {
  const lowerLength = [2.25, 2.05, 1.85, 2.05, 2.25][step] ?? 2.25
  const arrows = (y: number, outward: boolean, length: number) => {
    const half = length / 2
    const angle = outward ? 0.72 : -0.72
    return [-1, 1].flatMap((side) => [
      <Segment key={`${y}-${side}-a`} position={[side * (half + 0.14), y + 0.14, 0.2]} length={0.42} rotation={side * angle} />,
      <Segment key={`${y}-${side}-b`} position={[side * (half + 0.14), y - 0.14, 0.2]} length={0.42} rotation={-side * angle} />,
    ])
  }
  return (
    <group>
      <Segment position={[0, 0.38, 0.2]} length={2.25} thickness={0.06} />
      {arrows(0.38, true, 2.25)}
      <Segment position={[0, -0.38, 0.2]} length={lowerLength} thickness={0.06} color="#f09b4c" />
      {arrows(-0.38, false, lowerLength)}
    </group>
  )
}

function PonzoLive({ step }: { step: number }) {
  const upperY = 0.18 + step * 0.13
  return (
    <group>
      <Segment position={[-0.72, 0, 0.18]} length={2.2} rotation={1.27} color="#606972" />
      <Segment position={[0.72, 0, 0.18]} length={2.2} rotation={-1.27} color="#606972" />
      {Array.from({ length: 6 }, (_, index) => (
        <Segment key={index} position={[0, -0.72 + index * 0.28, 0.175]} length={2.8 - index * 0.37} color="#aeb3b3" thickness={0.025} />
      ))}
      <Segment position={[0, upperY, 0.21]} length={1.15} color="#f0a44c" thickness={0.09} />
      <Segment position={[0, -0.48, 0.21]} length={1.15} color="#f0a44c" thickness={0.09} />
    </group>
  )
}

function Circle({ position, radius, color }: { position: [number, number, number]; radius: number; color: string }) {
  return (
    <mesh position={position}>
      <circleGeometry args={[radius, 28]} />
      <meshBasicMaterial color={color} />
    </mesh>
  )
}

function EbbinghausLive({ step }: { step: number }) {
  return (
    <group>
      {[-0.82, 0.82].map((x, groupIndex) => {
        const large = (groupIndex + step) % 2 === 0
        const surroundRadius = large ? 0.25 : 0.1
        const orbit = large ? 0.53 : 0.38
        return (
          <group key={x}>
            {Array.from({ length: 8 }, (_, index) => {
              const angle = index / 8 * Math.PI * 2
              return (
                <Circle
                  key={index}
                  position={[x + Math.cos(angle) * orbit, Math.sin(angle) * orbit, 0.18]}
                  radius={surroundRadius}
                  color="#6f7780"
                />
              )
            })}
            <Circle position={[x, 0, 0.21]} radius={0.22} color="#f0a44c" />
          </group>
        )
      })}
    </group>
  )
}

function CafeWallLive({ step }: { step: number }) {
  const offset = 0.09 + step * 0.045
  return (
    <group>
      {Array.from({ length: 8 }, (_, row) =>
        Array.from({ length: 10 }, (_, column) => {
          const x = -1.42 + column * 0.315 + (row % 2 ? offset : -offset)
          const y = 0.67 - row * 0.19
          return (
            <mesh key={`${row}-${column}`} position={[x, y, 0.19]}>
              <planeGeometry args={[0.3, 0.16]} />
              <meshBasicMaterial color={(row + column) % 2 ? '#111317' : '#f2eee5'} />
            </mesh>
          )
        }),
      )}
      {Array.from({ length: 7 }, (_, row) => (
        <Segment key={row} position={[0, 0.575 - row * 0.19, 0.205]} length={3.1} color="#777b7c" thickness={0.022} />
      ))}
    </group>
  )
}

function NeckerCubeLive({ step }: { step: number }) {
  const front = [[-0.92, -0.55], [0.25, -0.55], [0.25, 0.58], [-0.92, 0.58]] as [number, number][]
  const back = front.map(([x, y]) => [x + 0.68, y + 0.34] as [number, number])
  const cueColor = step === 0 ? '#bc73ff' : '#58d6ff'
  return (
    <group>
      <mesh position={[step === 0 ? -0.335 : 0.345, step === 0 ? 0.015 : 0.355, 0.175]}>
        <planeGeometry args={[1.1, 1.05]} />
        <meshBasicMaterial color={cueColor} transparent opacity={0.25} />
      </mesh>
      {[front, back].flatMap((square, squareIndex) =>
        square.map((point, index) => (
          <SegmentBetween
            key={`${squareIndex}-${index}`}
            from={point}
            to={square[(index + 1) % 4]!}
            color="#18202a"
          />
        )),
      )}
      {front.map((point, index) => (
        <SegmentBetween key={`depth-${index}`} from={point} to={back[index]!} color="#18202a" />
      ))}
    </group>
  )
}

function MotionBlindnessLive({ step }: { step: number }) {
  const rotor = useRef<Group>(null)
  const focused = useMuseumStore((state) => state.focusedExhibitId === 'motion-induced-blindness')
  const reducedMotion = useMuseumStore((state) => state.settings.reducedMotion)
  const running = step % 2 === 0 && !reducedMotion
  useFrame((_, delta) => {
    if (focused && running && rotor.current) rotor.current.rotation.z += delta * 0.8
  })
  return (
    <group>
      <group ref={rotor}>
        {Array.from({ length: 18 }, (_, index) => {
          const angle = index / 18 * Math.PI * 2
          return (
            <group key={index} rotation={[0, 0, angle]}>
              <Circle position={[0.92, 0, 0.18]} radius={0.055} color="#7199b3" />
              <Segment position={[0.58, 0, 0.18]} length={0.28} color="#7199b3" thickness={0.025} />
            </group>
          )
        })}
      </group>
      {[-0.72, 0, 0.72].map((x, index) => (
        <Circle key={x} position={[x, index === 1 ? 0.56 : -0.45, 0.22]} radius={0.09} color="#f0e84f" />
      ))}
      <Segment position={[0, 0, 0.24]} length={0.25} color="#ffffff" thickness={0.035} />
      <Segment position={[0, 0, 0.24]} length={0.25} rotation={Math.PI / 2} color="#ffffff" thickness={0.035} />
    </group>
  )
}

function LiveEffect({ exhibit, step }: { exhibit: ExhibitDefinition; step: number }) {
  switch (exhibit.id) {
    case 'muller-lyer': return <MullerLyerLive step={step} />
    case 'ponzo': return <PonzoLive step={step} />
    case 'ebbinghaus': return <EbbinghausLive step={step} />
    case 'cafe-wall': return <CafeWallLive step={step} />
    case 'necker-cube': return <NeckerCubeLive step={step} />
    case 'motion-induced-blindness': return <MotionBlindnessLive step={step} />
    default: return null
  }
}

function LiveFrame({ exhibit }: { exhibit: ExhibitDefinition }) {
  const step = useMuseumStore((state) => state.liveExhibitSteps[exhibit.id] ?? 0)
  return (
    <group position={exhibit.position} rotation={exhibit.rotation}>
      <mesh castShadow>
        <boxGeometry args={[4.25, 2.8, 0.18]} />
        <meshStandardMaterial color="#0d1420" metalness={0.35} roughness={0.42} />
      </mesh>
      <mesh position={[0, 0.08, 0.12]}>
        <planeGeometry args={[3.8, 2.2]} />
        <meshStandardMaterial color="#e7e3da" emissive={exhibit.accent} emissiveIntensity={0.035} />
      </mesh>
      <LiveEffect exhibit={exhibit} step={step} />
      <ExhibitLabel exhibit={exhibit} position={[0, -1.72, 0.12]} />
      <mesh position={[0, -1.55, 0.78]} castShadow>
        <boxGeometry args={[1.35, 0.34, 1.05]} />
        <meshStandardMaterial color="#182331" emissive={exhibit.accent} emissiveIntensity={0.16} />
      </mesh>
      <Html position={[0, -1.48, 1.34]} center transform distanceFactor={6}>
        <span className="classics-action-label">E · TRY {step + 1}</span>
      </Html>
      <pointLight position={[0, 0.4, 1.2]} color={exhibit.accent} intensity={2.8} distance={4} />
    </group>
  )
}

export function ClassicsLab() {
  return (
    <group>
      <group position={[0, 0, 11.2]} rotation={[0, Math.PI, 0]}>
        <Portal position={[0, 0, 0]} color="#7ef4d2" label="CLASSICS LAB · LIVE GALLERY" />
      </group>
      {classics.map((exhibit) => (
        <LiveFrame key={exhibit.id} exhibit={exhibit} />
      ))}
    </group>
  )
}
