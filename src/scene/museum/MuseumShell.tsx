import { lazy, Suspense } from 'react'
import { Structure } from './shared'

const ArrivalAtrium = lazy(() => import('./ArrivalAtrium').then((module) => ({ default: module.ArrivalAtrium })))
const SignatureHall = lazy(() => import('./SignatureHall').then((module) => ({ default: module.SignatureHall })))
const ScaleLightRooms = lazy(() => import('./ScaleLightRooms').then((module) => ({ default: module.ScaleLightRooms })))
const ClassicsLab = lazy(() => import('./ClassicsLab').then((module) => ({ default: module.ClassicsLab })))

export function MuseumShell() {
  return (
    <group>
      <Structure position={[0, -0.15, 0]} scale={[38, 0.3, 36]} color="#0f1724" />
      <Structure position={[0, 3.15, -18]} scale={[38, 6.3, 0.35]} color="#101826" />
      <Structure position={[0, 3.15, 18]} scale={[38, 6.3, 0.35]} color="#101826" />
      <Structure position={[-19, 3.15, 0]} scale={[0.35, 6.3, 36]} color="#101826" />
      <Structure position={[19, 3.15, 0]} scale={[0.35, 6.3, 36]} color="#101826" />
      <Structure position={[0, 6.25, 0]} scale={[38, 0.2, 36]} color="#080e18" />

      <mesh position={[0, 0.018, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 35]} />
        <meshStandardMaterial color="#161d2a" roughness={0.55} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.022, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.2, 2.26, 64]} />
        <meshBasicMaterial color="#7ef4d2" toneMapped={false} />
      </mesh>
      <mesh position={[-9.5, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[18.6, 35]} />
        <meshStandardMaterial color="#111c23" roughness={0.88} />
      </mesh>
      <mesh position={[9.5, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[18.6, 35]} />
        <meshStandardMaterial color="#201923" roughness={0.88} />
      </mesh>

      <Suspense fallback={null}>
        <ArrivalAtrium />
        <ClassicsLab />
        <ScaleLightRooms />
        <SignatureHall />
      </Suspense>
    </group>
  )
}
