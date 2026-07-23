import { FloorMarker, Portal } from './shared'

type Point3 = [number, number, number]

type AnamorphicFace = {
  id: string
  color: string
  pattern: string[]
  viewPoint: Point3
  right: Point3
  rotation: Point3
  seed: number
}

const imageCenter: Point3 = [0, 4.12, 1.5]

const faces: AnamorphicFace[] = [
  {
    id: 'eye',
    color: '#76efd3',
    pattern: ['01110', '10001', '10101', '10001', '01110'],
    viewPoint: [0, 1.65, 8],
    right: [1, 0, 0],
    rotation: [0.34, 0, 0],
    seed: 1,
  },
  {
    id: 'stairs',
    color: '#ff68bd',
    pattern: ['00001', '00011', '00111', '01111', '11111'],
    viewPoint: [0, 1.65, -7],
    right: [-1, 0, 0],
    rotation: [-0.34, Math.PI, 0],
    seed: 3,
  },
  {
    id: 'diamond',
    color: '#ad92ff',
    pattern: ['00100', '01110', '11111', '01110', '00100'],
    viewPoint: [9, 1.65, 1.5],
    right: [0, 0, -1],
    rotation: [0, Math.PI / 2, 0.34],
    seed: 5,
  },
  {
    id: 'wave',
    color: '#ffe08a',
    pattern: ['00000', '01010', '10101', '01010', '00000'],
    viewPoint: [-9, 1.65, 1.5],
    right: [0, 0, 1],
    rotation: [0, -Math.PI / 2, -0.34],
    seed: 7,
  },
]

function pointAlongViewRay(
  viewPoint: Point3,
  imagePoint: Point3,
  amount: number,
): Point3 {
  return [
    viewPoint[0] + (imagePoint[0] - viewPoint[0]) * amount,
    viewPoint[1] + (imagePoint[1] - viewPoint[1]) * amount,
    viewPoint[2] + (imagePoint[2] - viewPoint[2]) * amount,
  ]
}

function FourWayAnamorph() {
  return (
    <group>
      {faces.flatMap((face) =>
        face.pattern.flatMap((row, rowIndex) =>
          [...row].map((pixel, columnIndex) => {
            if (pixel !== '1') return null
            const horizontal = (columnIndex - 2) * 0.48
            const vertical = (2 - rowIndex) * 0.48
            const imagePoint: Point3 = [
              imageCenter[0] + face.right[0] * horizontal,
              imageCenter[1] + vertical,
              imageCenter[2] + face.right[2] * horizontal,
            ]
            const depthStep = (rowIndex * 5 + columnIndex + face.seed) % 7
            const position = pointAlongViewRay(
              face.viewPoint,
              imagePoint,
              0.82 + depthStep * 0.045,
            )
            return (
              <mesh
                key={`${face.id}-${rowIndex}-${columnIndex}`}
                position={position}
                rotation={face.rotation}
              >
                <planeGeometry args={[0.39, 0.39]} />
                <meshBasicMaterial color={face.color} toneMapped={false} />
              </mesh>
            )
          }),
        ),
      )}
      <mesh position={[0, 4.12, 1.5]}>
        <octahedronGeometry args={[0.22, 0]} />
        <meshBasicMaterial color="#f4f1e8" toneMapped={false} />
      </mesh>
    </group>
  )
}

export function ArrivalAtrium() {
  return (
    <group>
      <FourWayAnamorph />
      <FloorMarker position={[0, 0.03, 7.6]} radius={0.78} />
      <group position={[0, 0, 7.4]}>
        <Portal position={[0, 0, 0]} color="#7ef4d2" label="ARRIVAL ATRIUM" />
      </group>
      <pointLight position={[0, 4.3, 1.5]} color="#f1eaff" intensity={38} distance={10} />
      <pointLight position={[0, 2.4, 5]} color="#76efd3" intensity={28} distance={8} />
    </group>
  )
}
