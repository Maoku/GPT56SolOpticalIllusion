import { Html } from '@react-three/drei'
import { useMemo } from 'react'
import {
  BufferGeometry,
  DoubleSide,
  Float32BufferAttribute,
} from 'three'
import { exhibitById } from '../../exhibits/exhibitCatalog'
import { useMuseumStore } from '../../state/useMuseumStore'
import {
  AMES_FIGURE_SCALE,
  AMES_REVEAL_POINT,
  AMES_VIEW_POINT,
  amesFigures,
  amesRoomSurfaces,
  type Point3,
} from '../interaction/amesRoom'
import { ExhibitLabel, FloorMarker } from '../museum/shared'

const exhibit = exhibitById.get('ames-room')!

function WarpedPanel({
  points,
  color,
  transparent = false,
}: {
  points: Point3[]
  color: string
  transparent?: boolean
}) {
  const geometry = useMemo(() => {
    const result = new BufferGeometry()
    result.setAttribute('position', new Float32BufferAttribute(points.flat(), 3))
    result.setIndex([0, 1, 2, 0, 2, 3])
    result.computeVertexNormals()
    return result
  }, [points])
  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial
        color={color}
        side={DoubleSide}
        transparent={transparent}
        opacity={transparent ? 0.34 : 1}
        roughness={0.82}
      />
    </mesh>
  )
}

function Figure({ position }: { position: Point3 }) {
  return (
    <group position={position} scale={AMES_FIGURE_SCALE}>
      <mesh position={[0, 1.56, 0]} castShadow>
        <sphereGeometry args={[0.22, 18, 12]} />
        <meshStandardMaterial color="#1b1d28" />
      </mesh>
      <mesh position={[0, 0.82, 0]} castShadow>
        <capsuleGeometry args={[0.24, 1.02, 8, 16]} />
        <meshStandardMaterial color="#e95f88" roughness={0.7} />
      </mesh>
    </group>
  )
}

export function SpatialAmesRoom() {
  const reveal = useMuseumStore((state) => state.activeExhibitId === exhibit.id && state.spatialStep > 0)
  return (
    <group>
      <WarpedPanel points={amesRoomSurfaces.floor} color={reveal ? '#d1b48f' : '#e4ddd0'} />
      <WarpedPanel points={amesRoomSurfaces.ceiling} color={reveal ? '#bba07e' : '#d7d1c7'} />
      <WarpedPanel points={amesRoomSurfaces.back} color="#eee7db" />
      <WarpedPanel points={amesRoomSurfaces.southWall} color={reveal ? '#9db3bd' : '#d5d8d5'} />
      <WarpedPanel points={amesRoomSurfaces.northWall} color="#83b8c2" transparent />

      {amesFigures.map((figure) => <Figure key={figure.id} position={figure.position} />)}

      <group name="ames-aperture-mask">
        <mesh position={[13.5, 0.08, -9]} rotation={[0, -Math.PI / 2, 0]}>
          <boxGeometry args={[7.6, 0.16, 0.22]} />
          <meshStandardMaterial color="#0b1018" />
        </mesh>
        <mesh position={[13.5, 3.18, -9]} rotation={[0, -Math.PI / 2, 0]}>
          <boxGeometry args={[7.6, 0.32, 0.22]} />
          <meshStandardMaterial color="#0b1018" />
        </mesh>
        <mesh position={[13.5, 1.62, -12.58]} rotation={[0, -Math.PI / 2, 0]}>
          <boxGeometry args={[0.32, 3.25, 0.22]} />
          <meshStandardMaterial color="#0b1018" />
        </mesh>
        <mesh position={[13.5, 1.62, -5.42]} rotation={[0, -Math.PI / 2, 0]}>
          <boxGeometry args={[0.32, 3.25, 0.22]} />
          <meshStandardMaterial color="#0b1018" />
        </mesh>
      </group>

      <FloorMarker position={[AMES_VIEW_POINT[0], 0.03, AMES_VIEW_POINT[2]]} color={exhibit.accent} />
      <FloorMarker position={[AMES_REVEAL_POINT[0], 0.035, AMES_REVEAL_POINT[2]]} color="#7ef4d2" />
      <ExhibitLabel exhibit={exhibit} position={[17.7, 3.85, -9]} />
      <pointLight position={[15.2, 2.6, -9]} color="#ffd9d9" intensity={16} distance={7} />
      <pointLight position={[17.6, 2.2, -6.6]} color="#c6f2ff" intensity={8} distance={5} />
      {reveal && (
        <Html position={[14.3, 2.9, -5.05]} center transform distanceFactor={6}>
          <span className="ames-reveal-label">SIDE VIEW · SAME SIZE</span>
        </Html>
      )}
    </group>
  )
}
