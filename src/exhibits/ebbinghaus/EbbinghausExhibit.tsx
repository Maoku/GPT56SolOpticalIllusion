import { useState } from 'react'
import { ExhibitRange } from '../interaction/ExhibitRange'
import type { ExhibitModuleProps } from '../interaction/types'

const targetRadius = 28
const ring = Array.from({ length: 8 }, (_, index) => (Math.PI * 2 * index) / 8)

function CircleGroup({ cx, radius, surroundRadius, orbit, hidden }: { cx: number; radius: number; surroundRadius: number; orbit: number; hidden: boolean }) {
  return <g>{!hidden && ring.map((angle) => <circle key={angle} cx={cx + Math.cos(angle) * orbit} cy={110 + Math.sin(angle) * orbit} r={surroundRadius} className="ebbinghaus-surround" />)}<circle cx={cx} cy="110" r={radius} className="ebbinghaus-center" /></g>
}

export function EbbinghausExhibit({ revealed, onInteract }: ExhibitModuleProps) {
  const [radius, setRadius] = useState(34)
  const update = (value: number) => { setRadius(value); onInteract() }
  return (
    <div className="illusion-module">
      <svg className="illusion-svg" viewBox="0 0 360 220" role="img" aria-label="異なる大きさの円で囲まれた中央円">
        <CircleGroup cx={100} radius={targetRadius} surroundRadius={10} orbit={55} hidden={revealed} />
        <CircleGroup cx={260} radius={radius} surroundRadius={29} orbit={70} hidden={revealed} />
        {revealed && <circle cx="260" cy="110" r={targetRadius} className="illusion-answer" />}
      </svg>
      <ExhibitRange label="右の中央円" value={radius} min={18} max={42} unit=" px" onChange={update} />
      <p className="measurement">{revealed ? `左 28 px / 右 ${radius} px — 誤差 ${Math.abs(radius - targetRadius)} px` : '中央円が同じ大きさに見える値を探します'}</p>
    </div>
  )
}
