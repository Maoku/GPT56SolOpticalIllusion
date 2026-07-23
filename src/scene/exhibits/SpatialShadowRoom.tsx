import { Html } from '@react-three/drei'
import { useMemo } from 'react'
import { Object3D } from 'three'
import { exhibitById } from '../../exhibits/exhibitCatalog'
import { useMuseumStore } from '../../state/useMuseumStore'
import {
  CHECKER_TARGET_COLOR,
  checkerShadowMask,
  checkerSceneStates,
  checkerTargets,
} from '../interaction/checkerShadow'
import { ExhibitLabel, FloorMarker, Structure } from '../museum/shared'

const exhibit = exhibitById.get('checker-shadow')!

function TargetLabel({ label, position }: { label: 'A' | 'B'; position: readonly [number, number, number] }) {
  return (
    <Html position={[position[0], 0.28, position[2]]} center transform sprite distanceFactor={4.5}>
      <span className="checker-target-label">{label}</span>
    </Html>
  )
}

export function SpatialShadowRoom() {
  const step = useMuseumStore((state) => state.activeExhibitId === exhibit.id ? state.spatialStep : 0)
  const sceneState = checkerSceneStates[Math.min(step, checkerSceneStates.length - 1)]!
  const lightTarget = useMemo(() => {
    const target = new Object3D()
    target.name = 'checker-shadow-light-target'
    return target
  }, [])
  return (
    <group>
      <Structure position={[18.05, 1.7, 0]} scale={[0.35, 3.4, 5.2]} color="#2b3035" />
      <Structure position={[16.55, 3.2, 0]} scale={[3.55, 0.18, 5.2]} color="#171c22" />
      <Structure position={[16.55, 1.55, -2.52]} scale={[3.55, 3.1, 0.18]} color="#171c22" />
      <Structure position={[16.55, 1.55, 2.52]} scale={[3.55, 3.1, 0.18]} color="#171c22" />
      {Array.from({ length: 24 }, (_, index) => {
        const row = Math.floor(index / 4)
        const column = index % 4
        const target = (row === 2 && column === 1) || (row === 3 && column === 2)
        const base = (row + column) % 2 === 0 ? '#c6c9c8' : '#3f454a'
        return (
          <mesh
            key={index}
            position={[15.2 + column * 0.72, 0.035, -1.8 + row * 0.72]}
            rotation={[-Math.PI / 2, 0, 0]}
            receiveShadow
          >
            <planeGeometry args={[0.7, 0.7]} />
            <meshStandardMaterial
              color={target ? CHECKER_TARGET_COLOR : base}
              emissive={sceneState.id === 'neutral' && target ? CHECKER_TARGET_COLOR : '#000000'}
              emissiveIntensity={sceneState.id === 'neutral' && target ? 0.32 : 0}
            />
          </mesh>
        )
      })}
      {sceneState.castsContextShadow && (
        <>
          <mesh
            name="checker-procedural-shadow"
            position={[...checkerShadowMask.position]}
            rotation={[-Math.PI / 2, 0, checkerShadowMask.angle]}
            scale={[checkerShadowMask.radiusX, checkerShadowMask.radiusZ, 1]}
            renderOrder={2}
          >
            <circleGeometry args={[1, 48]} />
            <meshBasicMaterial color="#111820" transparent opacity={0.72} depthWrite={false} />
          </mesh>
          <mesh position={[17.05, 0.8, -0.68]} castShadow>
            <cylinderGeometry args={[0.45, 0.55, 1.6, 28]} />
            <meshStandardMaterial color="#b8c1c7" roughness={0.5} />
          </mesh>
        </>
      )}
      <primitive object={lightTarget} position={[16.5, 0, 0.25]} />
      {sceneState.id !== 'neutral' && (
        <spotLight
          position={[14.7, 3.2, -2.6]}
          target={lightTarget}
          color={sceneState.id === 'context' ? '#ff91c9' : '#fff0cf'}
          intensity={38}
          distance={9}
          angle={0.58}
          penumbra={0.22}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
      )}
      {sceneState.connectsTargets && (
        <mesh position={[16.28, 0.062, 0]} rotation={[-Math.PI / 2, 0, -Math.PI / 4]} renderOrder={3}>
          <planeGeometry args={[1.38, 0.26]} />
          <meshBasicMaterial color={CHECKER_TARGET_COLOR} />
        </mesh>
      )}
      {sceneState.id === 'neutral' && <pointLight position={[15.7, 2.5, -0.5]} intensity={18} distance={6} color="#ffffff" />}
      <TargetLabel label="A" position={checkerTargets.A.position} />
      <TargetLabel label="B" position={checkerTargets.B.position} />
      <FloorMarker position={[12.8, 0.03, 0]} color={exhibit.accent} />
      <ExhibitLabel exhibit={exhibit} position={[17.6, 3.85, 0]} />
      <Html position={[12.8, 0.15, 0]} center transform sprite distanceFactor={5}>
        <span className="spatial-action-label">E · LIGHT</span>
      </Html>
    </group>
  )
}
